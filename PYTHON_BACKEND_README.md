# Python Backend with Vercel Functions

This project demonstrates how to integrate a Python backend using Vercel Functions within a Next.js application.

## 🚀 What's Included

- **Simple Hello Endpoint** (`/api/python/hello`) - Basic greeting with timestamp
- **Math Endpoint** (`/api/python/math`) - Mathematical calculations with query parameters
- **User Management Endpoint** (`/api/python/users`) - CRUD operations for users
- **Test Page** (`/python-test`) - Interactive UI to test all endpoints

## 📁 File Structure

```
src/app/api/python/
├── hello/
│   └── route.py          # Simple greeting endpoint
├── math/
│   └── route.py          # Math calculations endpoint
└── users/
    └── route.py          # User management endpoint

vercel.json               # Vercel configuration
requirements.txt          # Python dependencies
```

## 🛠️ Setup Instructions

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy to Vercel

```bash
# From your project root
vercel

# Follow the prompts to:
# - Link to existing project or create new one
# - Set up project settings
# - Deploy
```

### 3. Test Your Endpoints

Once deployed, your Python endpoints will be available at:

- `https://your-project.vercel.app/api/python/hello`
- `https://your-project.vercel.app/api/python/math?a=10&b=5`
- `https://your-project.vercel.app/api/python/users`

## 🔧 How It Works

### Vercel Functions

Vercel automatically detects Python files in the `api/` directory and deploys them as serverless functions. The `vercel.json` configuration specifies Python 3.11 as the runtime.

### Python Handler Pattern

Each endpoint uses the `BaseHTTPRequestHandler` class with methods like:

- `do_GET()` - Handle GET requests
- `do_POST()` - Handle POST requests
- `do_OPTIONS()` - Handle CORS preflight requests

### Response Format

All endpoints return JSON responses with proper CORS headers:

```python
self.send_response(200)
self.send_header('Content-type', 'application/json')
self.send_header('Access-Control-Allow-Origin', '*')
# ... other headers
```

## 🧪 Testing Locally

**Important**: Python functions only work when deployed to Vercel, not in local development.

To test locally, you can:

1. Deploy to Vercel first
2. Use the test page at `/python-test`
3. Test endpoints directly via browser or tools like Postman

## 📊 Example API Calls

### Hello Endpoint

```bash
GET /api/python/hello
```

Response:

```json
{
  "message": "Hello from Python Backend!",
  "timestamp": "2024-01-15T10:30:00.123456",
  "status": "success",
  "framework": "Python HTTP Server",
  "method": "GET"
}
```

### Math Endpoint

```bash
GET /api/python/math?a=10&b=5
```

Response:

```json
{
  "message": "Math calculations completed",
  "input": { "a": 10, "b": 5 },
  "calculations": {
    "addition": 15,
    "subtraction": 5,
    "multiplication": 50,
    "division": 2.0,
    "power": 100000,
    "square_root_a": 3.1622776601683795,
    "square_root_b": 2.23606797749979
  },
  "status": "success"
}
```

## 🔒 CORS Configuration

All endpoints include CORS headers to allow cross-origin requests:

```python
self.send_header('Access-Control-Allow-Origin', '*')
self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
self.send_header('Access-Control-Allow-Headers', 'Content-Type')
```

## 🚀 Next Steps

Once you've tested the basic endpoints, you can:

1. **Add Database Integration** - Connect to PostgreSQL, MongoDB, or other databases
2. **Authentication** - Implement JWT tokens or OAuth
3. **File Uploads** - Handle file uploads and storage
4. **External APIs** - Integrate with third-party services
5. **Background Jobs** - Implement async task processing

## 🐛 Troubleshooting

### Common Issues

1. **Function Not Found**: Ensure your Python files are in the correct `api/` directory structure
2. **Import Errors**: Check that all dependencies are in `requirements.txt`
3. **CORS Issues**: Verify CORS headers are properly set
4. **Deployment Failures**: Check Vercel logs for Python runtime errors

### Debugging

- Check Vercel function logs in the dashboard
- Use `vercel logs` command for real-time logs
- Test endpoints individually to isolate issues

## 📚 Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Python on Vercel](https://vercel.com/docs/functions/supported-languages#python)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python HTTP Server](https://docs.python.org/3/library/http.server.html)

## 🤝 Contributing

Feel free to extend this backend with:

- Additional endpoints
- Database integration
- Authentication systems
- More complex business logic

---

**Happy Coding! 🐍✨**
