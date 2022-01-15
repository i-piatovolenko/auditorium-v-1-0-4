import React from "react";
import CrashModeSettingsSection from "./sections/CrashModeSettingsSection";
import Header from "../../../components/header/Header";
import DispatcherSettingsSection from "./DispatcherSettingsSection";
import Back from "../../../components/icons/back/Back";

const DispatcherSettings = () => {
    return (
      <div>
        <Header>
          <Back/>
          <h1>Налаштування</h1>
        </Header>
        <DispatcherSettingsSection
          title='Режим невідповідності даних'
          hintText='Ви можете увімкнути цей режим при наявності невідповідностей на сітці аудиторій з реальною ситуацією (наприклад, при відсутності світла). Даний режим дозволяє студентам зрозуміти, що інформація на сітці аудиторій не є актуальною. Після усунення невідповідностей режим має бути вимкнуто.'
        >
          <CrashModeSettingsSection/>
        </DispatcherSettingsSection>
      </div>
    );
  }
;

export default DispatcherSettings;
