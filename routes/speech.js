import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Set up file storage for uploaded audio
const upload = multer({ dest: "uploads/" });

/** 
 * Speech-to-Text Route
 */
router.post("/speech-to-text", upload.single("audio"), async (req, res) => {
    try {
        const audioFilePath = req.file.path;
        const openAiApiKey = process.env.OPENAI_API_KEY;

        const audioData = fs.readFileSync(audioFilePath);

        const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            {
                file: audioData,
                model: "whisper-1",
            },
            {
                headers: {
                    "Authorization": `Bearer ${openAiApiKey}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        fs.unlinkSync(audioFilePath); // Clean up uploaded file
        res.json({ text: response.data.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** 
 * Text-to-Speech Route 
 */
router.post("/text-to-speech", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
        const { exec } = await import("child_process");
        const filename = `output.mp3`;

        exec(`gtts-cli "${text}" --output ${filename}`, (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.download(filename, () => {
                fs.unlinkSync(filename); // Clean up after download
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router (ES Module syntax)
export default router;
