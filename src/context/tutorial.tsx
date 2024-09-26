import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const TutorialContext = createContext<any>(null);

export const TutorialProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [chordsTutorial, setChordsTutorial] = useState<boolean>(false);
    const [chordsChangerTutorial, setChordsChangerTutorial] =
        useState<boolean>(false);
    const [menuTutorial, setMenuTutorial] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            const tutorial = await AsyncStorage.getItem("tutorial");

            if (tutorial) setChordsTutorial(JSON.parse(tutorial));
        };

        load();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("tutorial", JSON.stringify(chordsTutorial));
    }, [chordsTutorial]);

    const resetTutorial = () => {
        setChordsTutorial(false);
        setChordsChangerTutorial(false);
        setMenuTutorial(false);
    };

    const activateTutorial = () => {
        setChordsTutorial(true);
    };

    return (
        <TutorialContext.Provider
            value={{
                chordsTutorial,
                setChordsTutorial,
                chordsChangerTutorial,
                setChordsChangerTutorial,
                menuTutorial,
                setMenuTutorial,
                resetTutorial,
                activateTutorial,
            }}>
            {children}
        </TutorialContext.Provider>
    );
};
