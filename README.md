# NagarCycle: Waste-to-Resource Platform

A smart, AI-powered platform designed to revolutionize waste management by classifying waste and providing real-time pricing for recyclables.

## Features
- **AI waste Classification**: Uses Google Gemini 2.0 Flash to identify waste types from images.
- **Dynamic Pricing Engine**: Calculates the value of recyclables based on type, quality, and market demand.
- **Sassy AI Chatbot (Trashtalk)**: A witty assistant to guide users through waste disposal.
- **Multi-Tiered AI**: Automatic fallback to Hugging Face Vision models if Gemini is unavailable.
- **Real-time Marketplace**: Listing system for users to sell their waste to verified collectors.

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), CSS3 (Glassmorphism), HTML5.
- **Backend**: Node.js, Express.js.
- **AI/ML**: Google Gemini SDK, Hugging Face Inference API.
- **Auth/Database**: Firebase Authentication (Client-side), Local Storage for ephemeral state.

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/NagarCycle.git
cd NagarCycle
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your API keys:
```env
PORT=5000
GEMINI_API_KEY=your_actual_key
HF_API_TOKEN=your_fallback_token
```
*(See `.env.example` for details)*

### 4. Run the application
```bash
npm start
```
The application will be available at `http://localhost:5000`.

## Project Structure
- `server.js`: Main Express server orchestration.
- `services/aiService.js`: Core AI logic (Gemini + Hugging Face).
- `js/`: Frontend logic including `pricingEngine.js` and `trashtalk.js`.
- `style.css`: Modern UI with high-end glassmorphism effects.

## License
Distributed under the ISC License.

---
*Built for the NSUT INNOVATE '26 Hackathon - Turning waste into value one pixel at a time.*
