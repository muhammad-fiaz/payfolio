# Payfolio

<img src="https://github.com/user-attachments/assets/fc687071-057f-4680-9f2a-57aab7cf352e" alt="Preview" />

<h1 style="text-align: center;">Payfolio</h1>

Payfolio is a self-hosted payment application that serves as an alternative to Patreon, Ko-fi, and Buy Me a Coffee. It enables users to support creators by making small contributions. The platform allows users to choose the number of coffees they want to buy, enter their name and a message (both optional), specify the amount, and donate.

## Features

- Easy-to-use interface for making donations.
- Responsive design for a seamless experience on all devices.
- Dark mode support.
- Secure and fast transactions.
- Customizable donation options.
- Integration with Razorpay for handling payments.

## Technologies Used

- Next.js (React framework)
- Tailwind CSS
- TypeScript
- Node.js
- Razorpay (for payments)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- Node.js (v18 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/muhammad-fiaz/payfolio.git
```

2. Navigate to the project directory:

```bash
cd payfolio
```

3. Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Running the Application

To start the development server, run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

This will generate an optimized production build.

### Deployment

You can deploy the application to platforms that support Next.js, such as:

- Vercel
- Netlify
- Railway
- DigitalOcean
- AWS, etc.

## Payment Gateway

Payfolio uses Razorpay to handle payments securely. You will need to set up a Razorpay account and obtain the API keys to integrate it with Payfolio. Follow the Razorpay documentation for detailed instructions on setting up your account and obtaining the necessary credentials.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
