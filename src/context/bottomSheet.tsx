import React, {
    createContext,
    ReactNode,
    useContext,
    useRef,
    useState,
} from "react";
import { BottomSheetRefProps } from "../components/wrapers/bottomSheet";

export const BottomSheetContext = createContext<any>(null);

export const BottomSheetProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [bottomSheetContent, setBottomSheetContent] =
        useState<React.ReactNode | null>(null);
    const bottomSheetRef = useRef<BottomSheetRefProps>(null);

    return (
        <BottomSheetContext.Provider
            value={{
                bottomSheetContent,
                setBottomSheetContent,
                bottomSheetRef,
            }}>
            {children}
        </BottomSheetContext.Provider>
    );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
