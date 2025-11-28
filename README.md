# A FastAPI One-time File Sharer

A simple application for securely sharing files one-time. Built using FastAPI for the backend and JavaScript/CSS/HTML for the frontend.

## Features

- Upload files through a web interface
- Each file can be downloaded only once
- Simple, clean UI
- Secure and fast

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: JavaScript, HTML, CSS

## Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/viswajith275/A-FastAPI-One-time-File-Sharer.git
    cd A-FastAPI-One-time-File-Sharer
    ```

2. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Running the App

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

You can then access the application at [http://localhost:8000](http://localhost:8000).

### Project Structure

```
├── main.py          # FastAPI application entrypoint
├── static/          # Frontend files (JS/CSS/HTML)
├── templates/       # Jinja2 HTML templates
├── requirements.txt # Python dependencies
└── README.md        # Project documentation
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
