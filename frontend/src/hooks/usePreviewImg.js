import { useState } from "react";
import useShowToast from "./useShowToast";


const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const maxSize = 10 * 1024 * 1024;
			const chunkSize = 2 * 1024 * 1024;
			const chunks = Math.ceil(file.size / chunkSize);
			let chunkIndex = 0;

			if (file.size > maxSize) {
				showToast("File is too large. Please select an image with less than 10MB", "error");
			} else {
				const reader = new FileReader();

				reader.onloadend = () => {
					if (chunkIndex < chunks - 1) {
						chunkIndex++;
						const start = chunkIndex * chunkSize;
						const end = Math.min(start + chunkSize, file.size);
						const chunk = file.slice(start, end);
						reader.readAsArrayBuffer(chunk);
					} else {
						console.log("All chunks have been processed");
					}

					const base64String = arrayBufferToBase64(reader.result);
					setImgUrl(`data:image/png;base64,${base64String}`);
				};

				const chunk = file.slice(0, chunkSize);
				reader.readAsArrayBuffer(chunk);
			}
		} else {
			showToast("Invalid file type. Please select an image file", "error");
			setImgUrl(null);
		}
	};

	const arrayBufferToBase64 = (buffer) => {
		let binary = "";
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	};

	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
