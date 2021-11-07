// create a function to download video's and music of youtube show the output inside the console.
function loadVideo(video) {
    const youTube = require("youtube-node");
    const fs = require("fs");
    const youTubeApiKey = "AIzaSyD8e4bz4jKsYt1_c4_g8x2Xjt1FZHkEoFc";
    const youTubeApi = new youTube(youTubeApiKey);
    const path = require("path");
    const ffmpeg = require("fluent-ffmpeg");
    youTubeApi.setMaxResults(1);
    youTubeApi.setKey(youTubeApiKey);
    youTubeApi.search(video, 1, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            let json = JSON.parse(result);
            let items = json.items;
            let id = items[0].id.videoId;
            let title = items[0].snippet.title;
            let dir = path.join(__dirname, "videos");
            let file = path.join(dir, `${title}.mp4`);
            let file2 = path.join(dir, `${title}.mp3`);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            console.log(`Downloading video ${title}`);
            youTubeApi.getById(id, function(error, result) {
                if (error) {
                    console.log(error);
                } else {
                    let videoUrl = JSON.parse(result).items[0].id.videoId;
                    youTubeApi.getById(videoUrl, function(error, result) {
                        if (error) {
                            console.log(error);
                        } else {
                            let url = JSON.parse(result).items[0].snippet.thumbnails.high.url;
                            let file = path.join(dir, `${title}.mp4`);
                            let file2 = path.join(dir, `${title}.mp3`);
                            let command = ffmpeg(url)
                                .on("error", function(err) {
                                    console.log(err);
                                })
                                .on("end", function() {
                                    console.log("Finished");
                                })
                                .save(file);
                            let command2 = ffmpeg(file)
                                .on("error", function(err) {
                                    console.log(err);
                                })
                                .on("end", function() {
                                    console.log("Finished");
                                })
                                .save(file2);
                        }
                    });
                }
            });
        }
    });
}