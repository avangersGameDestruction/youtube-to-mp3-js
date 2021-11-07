// create a function to download video's and music of youtube show the output inside the console.
function loadVideo(video) {
    // npm install youtube-node
    const youTube = require("youtube-node");
    // npm install fs
    const fs = require("fs");
    // section for your youtube api key
    const youTubeApiKey = "your api key";
    // create a new instance of youtube node
    const youTubeApi = new youTube(youTubeApiKey);
    // npm install path
    const path = require("path");
    //npm install fluent-ffmpeg
    const ffmpeg = require("fluent-ffmpeg");
    // youTubeApi.setMaxResults(1); = a function to set the max results
    youTubeApi.setMaxResults(1);
    // youTubeApi.setKey(youTubeApiKey); = a function to set the api key
    youTubeApi.setKey(youTubeApiKey);
    // youTubeApi.search(video, 1, function(error, result) = a function to search the video and the max results
    youTubeApi.search(video, 1, function(error, result) {
        // if there is an error
        if (error) {
            // console.log(error); = a function to show the error
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