import { useEffect, useState } from "react";
import "./App.css";
import { CLASS_LIST, SKILL_LIST, SKILL_MODIFIER_MAPPING } from "./consts";
import { Row, Column } from "@react-tiny-grid/core";
import { getCharacter } from "./http";
import {
  Character,
  AttributeModifiers,
  Attributes,
  SkillPoints,
} from "./types";
import Modal from "./modal";

function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [attributeModifiers, setAttributeModifiers] =
    useState<AttributeModifiers | null>(null);
  const [openClassMinimumRequirements, setOpenClassMinimumRequirements] =
    useState<boolean>(false);
  const [classMinimumRequirements, setClassMinimumRequirements] = useState<{
    className: string;
    attributes: Attributes;
  }>({
    className: "",
    attributes: {
      Strength: 0,
      Dexterity: 0,
      Constitution: 0,
      Intelligence: 0,
      Wisdom: 0,
      Charisma: 0,
    },
  });
  const [skillTotalPoints, setSkillTotalPoints] = useState<SkillPoints>({
    Acrobatics: 0,
    "Animal Handling": 0,
    Arcana: 0,
    Athletics: 0,
    Deception: 0,
    History: 0,
    Insight: 0,
    Intimidation: 0,
    Investigation: 0,
    Medicine: 0,
    Nature: 0,
    Perception: 0,
    Performance: 0,
    Persuasion: 0,
    Religion: 0,
    "Sleight Of Hand": 0,
    Stealth: 0,
    Survival: 0,
  });
  const [totalAvailableSkillPoints, setTotalAvailableSkillPoints] = useState(0);
  const ATTRIBUTE_MAX_VALUE = 70;

  useEffect(() => {
    async function fetchCharacter() {
      try {
        setIsFetching(true);

        const character = await getCharacter();

        console.log(character);
        setCharacter(character);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsFetching(false);
      }
    }
    fetchCharacter();

    // TODO: Call the API to save the character
  }, []);

  useEffect(() => {
    if (character) {
      calculateAttributeModifiers(character);
    }
  }, [character]);

  useEffect(() => {
    function calculateSkillTotalPoints(character: Character) {
      Object.entries(character.skillPoints).forEach(
        ([skillName, skillValue]) => {
          const totalPoints =
            skillValue + attributeModifiers[SKILL_MODIFIER_MAPPING[skillName]];
          setSkillTotalPoints((prevSkillPoints) => ({
            ...prevSkillPoints,
            [skillName]: totalPoints,
          }));
        },
      );
    }

    if (character && attributeModifiers) {
      calculateSkillTotalPoints(character);
      setTotalAvailableSkillPoints(
        10 + (4 * attributeModifiers?.Intelligence || 0),
      );
    }
  }, [attributeModifiers, character]);

  function calculateAttributeModifiers(character: Character) {
    Object.entries(character.attributes).forEach(([attrName, attrValue]) => {
      setAttributeModifiers((prevModifiers) => ({
        ...prevModifiers,
        [attrName]: Math.floor((attrValue - 10) / 2),
      }));
    });
  }

  function getTotalAttributePoints() {
    return Object.values(character?.attributes || {}).reduce(
      (acc, curr) => acc + curr,
      0,
    );
  }

  function handleAttributeIncrement(attrName: string) {
    if (getTotalAttributePoints() >= ATTRIBUTE_MAX_VALUE) {
      alert("You have reached the maximum attribute points");
      return;
    }

    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      attributes: {
        ...prevCharacter?.attributes,
        [attrName]: (prevCharacter?.attributes[attrName] || 0) + 1,
      },
    }));
  }

  function handleAttributeDecrement(attrName: string) {
    if (character?.attributes[attrName] <= 0) {
      return;
    }

    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      attributes: {
        ...prevCharacter?.attributes,
        [attrName]: (prevCharacter?.attributes[attrName] || 0) - 1,
      },
    }));
  }

  function getTotalSkillPointsUsed() {
    return Object.values(character?.skillPoints || {}).reduce(
      (acc, curr) => acc + curr,
      0,
    );
  }

  function handleSkillIncrement(skillName: string) {
    if (getTotalSkillPointsUsed() >= totalAvailableSkillPoints) {
      alert("You have reached the maximum skill points");
      return;
    }

    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      skillPoints: {
        ...prevCharacter?.skillPoints,
        [skillName]: (prevCharacter?.skillPoints[skillName] || 0) + 1,
      },
    }));
  }

  function handleSkillDecrement(skillName: string) {
    if (character?.skillPoints[skillName] <= 0) {
      return;
    }

    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      skillPoints: {
        ...prevCharacter?.skillPoints,
        [skillName]: (prevCharacter?.skillPoints[skillName] || 0) - 1,
      },
    }));
  }

  function handleOpenClassMinimumRequirements(className: string) {
    setClassMinimumRequirements({
      className: className,
      attributes: CLASS_LIST[className],
    });
    setOpenClassMinimumRequirements(true);
  }

  function handleCloseClassMinimumRequirements() {
    setClassMinimumRequirements({
      className: "",
      attributes: {
        Strength: 0,
        Dexterity: 0,
        Constitution: 0,
        Intelligence: 0,
        Wisdom: 0,
        Charisma: 0,
      },
    });
    setOpenClassMinimumRequirements(false);
  }

  function meetMinimumRequirements(className: string) {
    return Object.entries(CLASS_LIST[className]).every(
      ([attrName, attrValue]) => character?.attributes[attrName] >= attrValue,
    );
  }

  // TODO: Componentize the renderings
  return (
    <div className="App">
      <Modal
        open={
          openClassMinimumRequirements &&
          classMinimumRequirements.className !== ""
        }
        onClose={() => setOpenClassMinimumRequirements(false)}
      >
        <h2>Class Minimum Requirements</h2>
        <h3>{classMinimumRequirements["className"]}</h3>
        <ul className="class-minimum-requirements">
          {Object.entries(classMinimumRequirements["attributes"]).map(
            ([attrName, attrValue], index) => (
              <li key={index}>
                {attrName}: {attrValue}
              </li>
            ),
          )}
        </ul>
        <div id="confirmation-actions">
          <button
            onClick={handleCloseClassMinimumRequirements}
            className="button"
          >
            Close
          </button>
        </div>
      </Modal>
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      {isFetching && <div>Loading...</div>}
      {isError && <div>Error fetching character</div>}
      {!isFetching && !isError && character && (
        <section className="App-section">
          <Row>
            <Column>
              <h2>Skills Check</h2>
              <div>
                <label htmlFor="skill-name">Skill: </label>
                <select id="skill-name">
                  {SKILL_LIST.map((skill) => (
                    <option key={skill.name} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="dc">DC: </label>
                <input id="dc" type="text" placeholder="20" />
                <button>Roll</button>
              </div>
            </Column>
          </Row>
          <Row>
            <Column>
              <h2>Attributes</h2>
              <ul className="attributes-list">
                {Object.entries(character?.attributes || {}).map(
                  ([attrName, attrValue], index) => (
                    <li key={index}>
                      {attrName}: {attrValue} (Modifier:{" "}
                      {attributeModifiers?.[attrName]})
                      <button
                        onClick={() => handleAttributeIncrement(attrName)}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleAttributeDecrement(attrName)}
                      >
                        -
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </Column>
            <Column>
              <h2>Classes</h2>
              <ul className="class-list">
                {Object.entries(CLASS_LIST).map(([className, _], index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleOpenClassMinimumRequirements(className)
                    }
                  >
                    {meetMinimumRequirements(className) && (
                      <span style={{ color: "red" }}>{className}</span>
                    )}
                    {!meetMinimumRequirements(className) && (
                      <span>{className}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Column>
            <Column>
              <h2>Skills</h2>
              <h3>Total Available Skill Points: {totalAvailableSkillPoints}</h3>
              <ul className="skills-list">
                {Object.entries(character.skillPoints).map(
                  ([skillName, skillValue], index) => (
                    <li key={index}>
                      {skillName}: {skillValue} (Modifier:{" "}
                      {SKILL_MODIFIER_MAPPING[skillName]}:{" "}
                      {attributeModifiers?.[SKILL_MODIFIER_MAPPING[skillName]]})
                      <button onClick={() => handleSkillIncrement(skillName)}>
                        +
                      </button>
                      <button onClick={() => handleSkillDecrement(skillName)}>
                        -
                      </button>
                      <span>Total: {skillTotalPoints[skillName]}</span>
                    </li>
                  ),
                )}
              </ul>
            </Column>
          </Row>
        </section>
      )}
    </div>
  );
}

export default App;
