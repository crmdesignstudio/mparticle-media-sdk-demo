# mParticle Media SDK Demo

This project demonstrates the integration of mParticle's Media SDK for tracking video content and advertisement playback. It showcases a complete implementation of media tracking features including content playback, pre-roll ads, and detailed event logging.

## Features

- Video content playback with mParticle Media tracking
- Pre-roll advertisement integration
- Real-time event logging display
- Comprehensive media session tracking
- Advertisement quartile tracking
- Quality of Service (QoS) monitoring
- Playhead position tracking
- Buffer state tracking
- Manual session control

## Prerequisites

- Node.js (v12 or higher)
- NPM (v6 or higher)
- A mParticle account with an API key

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd mparticle-media-sdk-demo
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your mParticle API key:
```bash
MPARTICLE_WEB_API_KEY=your-api-key-here
```
   - For development, you can copy the example environment file:
```bash
cp .env.example .env
```
   Then replace the placeholder API key with your actual key.

4. Start the development server:
```bash
npm start
```

## Usage

The demo application provides a video player with the following workflow:

1. When the page loads, a muted pre-roll advertisement will play automatically
2. After the ad ends, a "Click to Play Content" button appears
3. Clicking the button will start and unmute the main content
4. The main video player includes standard HTML5 video controls
5. An "End Media Session" button allows manual termination of the tracking session
6. All media events are logged in real-time in the events log section

## Project Structure

```
mparticle-media-sdk-demo/
├── src/
│   ├── index.html      # Main HTML file with video player
│   └── index.js        # JavaScript implementation with mParticle integration
├── .env               # Environment variables (not committed to git)
├── .env.example      # Example environment variables template
├── webpack.config.js # Webpack configuration
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

## Development

The project uses webpack-dev-server for development with the following features:

- Hot Module Replacement (HMR) for instant updates
- Environment variable support via dotenv-webpack
- Babel transpilation for modern JavaScript
- CSS loading and processing
- Automatic browser opening and reloading

### Webpack Configuration

The project includes a comprehensive webpack setup:

- **Development Mode**: Optimized for development with source maps
- **Babel Integration**: Transpiles modern JavaScript features
- **Environment Variables**: Securely loads variables from `.env` file
- **Asset Handling**: Processes JavaScript and CSS files
- **Dev Server**: Configured with hot reloading at port 8081

To modify the webpack configuration:
1. Edit `webpack.config.js` in the root directory
2. Restart the development server to apply changes

### Environment Variables

The following environment variables are required:

| Variable | Description |
|----------|-------------|
| MPARTICLE_WEB_API_KEY | Your mParticle Web API key |

Environment variables are:
- Loaded from `.env` file
- Validated against `.env.example`
- Available in code via `process.env.VARIABLE_NAME`
- Protected from git via `.gitignore`

### Development Workflow

1. Start the development server:
```bash
npm start
```

2. Make changes to source files:
   - Edit files in the `src/` directory
   - Changes are automatically reflected in the browser
   - Check the console for build errors

3. To modify video content:
   - Update video source URLs in `src/index.html`
   - Adjust media content details in `initializeMediaTracking()` in `src/index.js`

## Tracked Events

The demo tracks the following events:

### Content Events
- Media Session Start/End
- Play/Pause
- Seek Start/End
- Buffer Start/End
- Playhead Position Updates
- Quality of Service (QoS) Metrics

### Advertisement Events
- Ad Break Start/End
- Ad Start/End
- Ad Quartile Progress (25%, 50%, 75%)
- Ad Pause/Resume
- Ad Buffer States

## Troubleshooting

Common issues and solutions:

1. **Video doesn't autoplay**: Modern browsers require videos to be muted for autoplay. The demo handles this by starting muted and allowing unmuting after user interaction.

2. **Events not logging**: Ensure your mParticle API key is correctly set in the `.env` file and the SDK is properly initialized.

3. **CORS errors**: Make sure your video sources allow cross-origin access.

4. **Environment variables not loading**: 
   - Verify `.env` file exists in the root directory
   - Check webpack configuration in `webpack.config.js`
   - Ensure variable names match between `.env` and code
   - Restart the development server after changing environment variables

5. **Build errors**:
   - Check the console for detailed error messages
   - Verify all dependencies are installed (`npm install`)
   - Clear the build cache and node modules if needed:
     ```bash
     rm -rf node_modules
     rm -rf dist
     npm install
     ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [mParticle Web SDK](https://github.com/mParticle/mparticle-web-sdk)
- [mParticle Media SDK](https://github.com/mParticle/mparticle-web-media-sdk)
- Sample videos provided by [Google Sample Media](https://github.com/google/sample-media)

## Deployment

### Deploying to Vercel

1. Push your code to GitHub

2. Connect your repository to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Select the project

3. Configure environment variables:
   - Go to Project Settings > Environment Variables
   - Add `MPARTICLE_WEB_API_KEY` with your API key

4. Deploy:
   - Vercel will automatically build and deploy your project
   - Each push to the main branch will trigger a new deployment

The build process will:
- Run `npm run build` to create a production build
- Output files to the `dist` directory
- Optimize and minify all assets
- Inject environment variables

### Production Build

To create a production build locally:
```bash
npm run build
```

This will:
- Create an optimized production build in the `dist` directory
- Minify JavaScript and HTML
- Apply production-specific optimizations 