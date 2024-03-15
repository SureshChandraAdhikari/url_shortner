const express = require("express");
const urlRoute = require("./Routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./Model/url");
const shortId = require("shortid");

const app = express();
const PORT = 8000;
connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
    console.log("Mongodb Connected")
);
app.use(express.json());
app.use("/url", urlRoute);
app.get("/:shortId", async (res, req) => {
    const shortId = req.params.shortId;
    const entry = await URL.findByOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
});
