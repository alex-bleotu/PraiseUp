import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const TutorialContext = createContext<any>(null);

export const TutorialProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [chordsTutorial, setChordsTutorial] = useState<boolean>(true);
    const [chorodsChangerTutorial, setChordsChangerTutorial] =
        useState<boolean>(false);
    const [presentationTutorial, setPresentationTutorial] =
        useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            const chordsTutorial = await AsyncStorage.getItem("chordsTutorial");
            if (chordsTutorial) {
                setChordsTutorial(JSON.parse(chordsTutorial));
            }

            const chorodsChangerTutorial = await AsyncStorage.getItem(
                "chorodsChangerTutorial"
            );
            if (chorodsChangerTutorial) {
                setChordsChangerTutorial(JSON.parse(chorodsChangerTutorial));
            }

            const presentationTutorial = await AsyncStorage.getItem(
                "presentationTutorial"
            );
            if (presentationTutorial) {
                setPresentationTutorial(JSON.parse(presentationTutorial));
            }
        };

        load();
    }, []);

    useEffect(() => {
        if (chordsTutorial === false) return;
        AsyncStorage.setItem("chordsTutorial", JSON.stringify(chordsTutorial));
    }, [chordsTutorial]);

    useEffect(() => {
        if (chorodsChangerTutorial === false) return;
        AsyncStorage.setItem(
            "chorodsChangerTutorial",
            JSON.stringify(chorodsChangerTutorial)
        );
    }, [chorodsChangerTutorial]);

    useEffect(() => {
        if (presentationTutorial === false) return;
        AsyncStorage.setItem(
            "presentationTutorial",
            JSON.stringify(presentationTutorial)
        );
    }, [presentationTutorial]);

    const resetTutorial = () => {
        setChordsTutorial(false);
        setChordsChangerTutorial(false);
        setPresentationTutorial(false);
    };

    const activateTutorial = () => {
        setChordsTutorial(true);
        setChordsChangerTutorial(true);
        setPresentationTutorial(true);
    };

    return (
        <TutorialContext.Provider
            value={{
                chordsTutorial,
                setChordsTutorial,
                chorodsChangerTutorial,
                setChordsChangerTutorial,
                presentationTutorial,
                setPresentationTutorial,
                resetTutorial,
                activateTutorial,
            }}>
            {children}
        </TutorialContext.Provider>
    );
};
