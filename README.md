<h1 align="center">Subtitler Clean</h1>

---

<p align="center">
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-%23F8952D">
  </a>
  <a href="#">
    <img alt="Coverage" src="https://img.shields.io/badge/coverage-100%25-brightgreen">
  </a>
  <a href="package.json">
    <img alt="Version" src="https://img.shields.io/badge/version-v1.0.0-orange">
  </a>
</p>

---

<h3 align="center">
  <a href="#information_source-about">About</a>&nbsp;|
  <a href="#seedling-requirements">Requirements</a>&nbsp;|
  <a href="#question-how-to-use">How to Use</a>&nbsp;|
  <a href="#rocket-technologies">Technologies</a>&nbsp;|
  <a href="#license">License</a>
</h3>

---

## :information_source: About

This project is used to automatically create subtitles for any audio or video, using an external service (e.g. Youtube Data API).

## :seedling: Requirements

- NodeJs v14.0.0
- FFmpeg v4.1.8
- Youtube API enabled on Google Cloud Platform
- Oauth 2.0 ID Client

## :question: How to Use

First, you need to enable an external service that will create the subtitles, like Youtube Data API, this project is built trying to follow the principles of clean architecture, so you can implement your adapter of any other service without much difficulty.

If you are interested in creating your implementation to use services other than Youtube API, see [main](/src/main) and [infra](/src/infra) layers.

If you want to use it as it is, the following links may be useful:

- [How to create a project](https://developers.google.com/workspace/guides/create-project)
- [Enabling Google APIs](https://developers.google.com/workspace/guides/enable-apis)
- [OAuth Client ID](https://developers.google.com/workspace/guides/create-credentials#oauth-client-id)

After getting the credentials, you should have a `JSON` file with your credentials, rename it to `subtitler-credentials.json`, and put it at the **root** of this project. See [env.ts](/src/main/config/env.ts).

I'm assuming you already have NodeJs v14 installed, in addition, you need [FFmpeg](https://ffmpeg.org/), install it, and add it to your PATH (as an environment variable). See [video.ts](/src/infra/disk/local/video-from-audio-storage/video.ts) and [subtitle.ts](/src/infra/external/youtube-api/subtitle-service/subtitle.ts)

After this, run:

```bash
npm install
npm start
```

You should see a URL on your terminal, you need to access it to give your consent to google

You should also see `http://localhost:3000`, this is the app server location, open it on a browser

## :rocket: Technologies

This project uses the following technologies

- NodeJS
- FFmpeg
- TypeScript
- SQLite
- Express
- JavaScript
- HTML
- CSS

## License

This project is under the MIT license. see [LICENSE](LICENSE) for more details
