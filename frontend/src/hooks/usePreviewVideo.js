import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewVid = () => {
    const [vidUrl, setVidUrl] = useState(null);
    const showToast = useShowToast();

    // Handle Video
    const handleVideoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const tempVideo = document.createElement('video');
                tempVideo.src = reader.result;

                tempVideo.onloadedmetadata = () => {
                    if (tempVideo.duration === Infinity || tempVideo.duration > 0) {
                        setVidUrl(reader.result);
                    } else {
                        showToast("Invalid video file", "Please select a valid video file", "error");
                        setVidUrl(null);
                    }
                };
            };

            reader.readAsDataURL(file);
        } else {
            showToast("Invalid file type", "Please select a video type of file", "error");
            setVidUrl(null);
        }
    };

    return { handleVideoChange, vidUrl, setVidUrl };
}

export default usePreviewVid;
