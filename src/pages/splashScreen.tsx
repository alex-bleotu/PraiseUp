import { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ResizeMode, Video } from "expo-av";

const App = ({
    dark = false,
    onFinish,
    onStart,
}: {
    dark: boolean;
    onFinish: any;
    onStart: any;
}) => {
    const videoRef = useRef(null);

    const [isVideoFinished, setIsVideoFinished] = useState(false);
    const [didVideoStart, setDidVideoStart] = useState(false);

    const lightVideo = require("../../assets/splashLight.mp4");
    const darkVideo = require("../../assets/splashDark.mp4");

    const handlePlaybackStatusUpdate = (status: any) => {
        if (status.didJustFinish) {
            setIsVideoFinished(true);
            onFinish(true);
        }

        if (status.isPlaying && !didVideoStart) {
            onStart();
            setDidVideoStart(true);
        }
    };

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={dark ? darkVideo : lightVideo}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay={!isVideoFinished}
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    video: {
        width: "100%",
        height: "100%",
    },
});

export default App;
