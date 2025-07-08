# 🔌 CraftFrame API Reference

**Complete API documentation for developers integrating with CraftFrame.**

---

## 📋 **Table of Contents**

1. [Authentication](#authentication)
2. [Image Generation](#image-generation)
3. [Video Generation](#video-generation)
4. [User Management](#user-management)
5. [Generation Status](#generation-status)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [SDK Examples](#sdk-examples)

---

## 🔐 **Authentication**

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 🔑 **Authentication Endpoints**

### POST `/auth/login`

Authenticate user and receive JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "credits": 50,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (401):**

```json
{
  "error": "Invalid email or password"
}
```

### POST `/auth/register`

Create new user account.

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "Jane Doe"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "new-user-uuid",
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "credits": 50,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error (400):**

```json
{
  "error": "Email already exists"
}
```

### POST `/auth/demo`

Get demo account access with temporary credentials.

**Request:**

```json
{}
```

**Response (200):**

```json
{
  "token": "demo-jwt-token",
  "user": {
    "id": "demo-user-id",
    "email": "demo@craftframe.app",
    "name": "Demo User",
    "credits": 1000,
    "isDemo": true
  }
}
```

---

## 🎨 **Image Generation**

### POST `/studio/generate-image`

Generate AI image with advanced parameters.

**Headers:**

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request:**

```json
{
  "prompt": "A beautiful sunset over mountains with lake reflection",
  "model": "flux-pro",
  "category": "photorealistic",
  "size": "2048x2048",
  "steps": 30,
  "cfg_scale": 7.5,
  "style": "cinematic, highly detailed"
}
```

**Parameters:**

| Parameter   | Type   | Required | Description                         | Values                                                                                           |
| ----------- | ------ | -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `prompt`    | string | Yes      | Text description of desired image   | 3-500 characters                                                                                 |
| `model`     | string | No       | AI model to use                     | `flux-pro`, `flux-dev`, `sdxl`, `huggingface`                                                    |
| `category`  | string | No       | Art style category                  | `photorealistic`, `anime`, `painting`, `sketch`, `realistic`, `3d-render`, `abstract`, `fantasy` |
| `size`      | string | No       | Output image dimensions             | `1024x1024`, `2048x2048`, `1920x1080`                                                            |
| `steps`     | number | No       | Generation steps (quality vs speed) | 10-50 (default: 30)                                                                              |
| `cfg_scale` | number | No       | Prompt adherence strength           | 1-20 (default: 7.5)                                                                              |
| `style`     | string | No       | Additional style modifiers          | Any descriptive text                                                                             |

**Response (200):**

```json
{
  "id": "img_1704067200_abc123def",
  "status": "generating",
  "metadata": {
    "model": "flux-pro",
    "category": "photorealistic",
    "credits_used": 4,
    "estimated_time": 30
  }
}
```

**Response (Completed):**

```json
{
  "id": "img_1704067200_abc123def",
  "url": "https://craftframe.com/generated/image.jpg",
  "status": "completed",
  "metadata": {
    "width": 2048,
    "height": 2048,
    "model": "flux-pro",
    "category": "photorealistic",
    "enhancedPrompt": "A beautiful sunset over mountains with lake reflection, photorealistic, professional photography, high detail, ultra realistic, 8K quality, cinematic, highly detailed",
    "source": "huggingface",
    "quality": "premium",
    "credits_used": 4,
    "generation_time": 28.5
  }
}
```

### Model Credits & Quality

| Model         | Credits | Quality      | Resolution | Speed  |
| ------------- | ------- | ------------ | ---------- | ------ |
| `flux-pro`    | 4       | Premium      | 2048x2048  | 30-45s |
| `flux-dev`    | 3       | Professional | 1024x1024  | 20-30s |
| `sdxl`        | 3       | Professional | 1024x1024  | 15-25s |
| `huggingface` | 4       | Premium      | 2048x2048  | 25-40s |

---

## 🎬 **Video Generation**

### POST `/studio/generate-video`

Generate AI video content.

**Request:**

```json
{
  "prompt": "A cat gracefully walking through a blooming garden",
  "model": "huggingface",
  "duration": 5,
  "fps": 24,
  "style": "cinematic"
}
```

**Parameters:**

| Parameter  | Type   | Required | Description               | Values                                           |
| ---------- | ------ | -------- | ------------------------- | ------------------------------------------------ |
| `prompt`   | string | Yes      | Text description of video | 3-500 characters                                 |
| `model`    | string | No       | AI model to use           | `huggingface`, `pika`, `luma`, `runway`          |
| `duration` | number | No       | Video length in seconds   | 3-10 (default: 5)                                |
| `fps`      | number | No       | Frames per second         | 8-30 (default: 24)                               |
| `style`    | string | No       | Video style modifier      | `cinematic`, `realistic`, `animated`, `artistic` |

**Response (200):**

```json
{
  "id": "vid_1704067200_xyz789abc",
  "status": "generating",
  "metadata": {
    "model": "huggingface",
    "duration": 5,
    "fps": 24,
    "credits_used": 5,
    "estimated_time": 60
  }
}
```

**Response (Completed):**

```json
{
  "id": "vid_1704067200_xyz789abc",
  "url": "https://craftframe.com/generated/video.mp4",
  "status": "completed",
  "metadata": {
    "duration": 5,
    "fps": 24,
    "resolution": "1280x720",
    "model": "CogVideoX-5B",
    "source": "huggingface",
    "quality": "professional",
    "frames": 120,
    "file_size": 15728640,
    "credits_used": 5,
    "generation_time": 58.2
  }
}
```

### Video Model Credits & Quality

| Model         | Credits | Quality      | Max Duration | Resolution | Speed   |
| ------------- | ------- | ------------ | ------------ | ---------- | ------- |
| `huggingface` | 5       | Premium      | 10s          | 1280x720   | 45-90s  |
| `pika`        | 4       | Professional | 5s           | 1024x576   | 30-60s  |
| `luma`        | 4       | Professional | 5s           | 1024x576   | 30-60s  |
| `runway`      | 5       | Premium      | 5s           | 1280x720   | 60-120s |

---

## 📊 **Generation Status**

### GET `/studio/generation/:id`

Check generation status and retrieve result.

**Parameters:**

- `id` (path): Generation ID

**Response (Generating):**

```json
{
  "id": "img_1704067200_abc123def",
  "status": "generating",
  "progress": 65,
  "estimated_remaining": 12,
  "metadata": {
    "model": "flux-pro",
    "category": "photorealistic"
  }
}
```

**Response (Completed):**

```json
{
  "id": "img_1704067200_abc123def",
  "url": "https://craftframe.com/generated/image.jpg",
  "status": "completed",
  "progress": 100,
  "metadata": {
    "width": 2048,
    "height": 2048,
    "model": "flux-pro",
    "generation_time": 28.5
  }
}
```

**Response (Failed):**

```json
{
  "id": "img_1704067200_abc123def",
  "status": "failed",
  "error": "Model timeout - content flagged by safety filter",
  "metadata": {
    "model": "flux-pro",
    "retry_possible": true
  }
}
```

### Status Values

| Status       | Description                   |
| ------------ | ----------------------------- |
| `generating` | Currently being processed     |
| `completed`  | Successfully generated        |
| `failed`     | Generation failed (see error) |
| `queued`     | Waiting in generation queue   |
| `cancelled`  | Cancelled by user or system   |

---

## 👤 **User Management**

### GET `/users/profile`

Get current user profile information.

**Response (200):**

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "credits": 42,
  "totalGenerations": 158,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-15T10:30:00.000Z",
  "subscription": {
    "plan": "free",
    "credits_per_month": 50,
    "next_refill": "2024-02-01T00:00:00.000Z"
  }
}
```

### PUT `/users/profile`

Update user profile information.

**Request:**

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200):**

```json
{
  "id": "user-uuid",
  "email": "johnsmith@example.com",
  "name": "John Smith",
  "credits": 42,
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

### GET `/users/generations`

Get user's generation history with pagination.

**Query Parameters:**

| Parameter | Type   | Default | Description                       |
| --------- | ------ | ------- | --------------------------------- |
| `page`    | number | 1       | Page number                       |
| `limit`   | number | 20      | Items per page (max 100)          |
| `type`    | string | all     | Filter by type (`image`, `video`) |
| `status`  | string | all     | Filter by status                  |

**Example:**

```
GET /api/users/generations?page=1&limit=10&type=image&status=completed
```

**Response (200):**

```json
{
  "generations": [
    {
      "id": "img_1704067200_abc123def",
      "type": "image",
      "prompt": "Beautiful sunset over mountains",
      "url": "https://craftframe.com/generated/image1.jpg",
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "metadata": {
        "model": "flux-pro",
        "category": "photorealistic",
        "credits_used": 4
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 158,
    "pages": 16,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### DELETE `/users/generation/:id`

Delete a specific generation.

**Response (200):**

```json
{
  "message": "Generation deleted successfully"
}
```

---

## ⚠️ **Error Handling**

### Error Response Format

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error context"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_abc123def789"
}
```

### Common Error Codes

| HTTP Status | Code                     | Description                    |
| ----------- | ------------------------ | ------------------------------ |
| 400         | `INVALID_REQUEST`        | Request validation failed      |
| 401         | `UNAUTHORIZED`           | Authentication required        |
| 403         | `INSUFFICIENT_CREDITS`   | Not enough credits             |
| 404         | `NOT_FOUND`              | Resource not found             |
| 409         | `GENERATION_IN_PROGRESS` | Generation already in progress |
| 429         | `RATE_LIMIT_EXCEEDED`    | Too many requests              |
| 500         | `GENERATION_FAILED`      | AI service error               |
| 503         | `SERVICE_UNAVAILABLE`    | Temporary service outage       |

### Example Error Responses

**Insufficient Credits (403):**

```json
{
  "error": "Insufficient credits for this generation",
  "code": "INSUFFICIENT_CREDITS",
  "details": {
    "required": 4,
    "available": 2,
    "model": "flux-pro"
  }
}
```

**Rate Limit Exceeded (429):**

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 5,
    "window": "60 seconds",
    "retryAfter": 45
  }
}
```

**Invalid Prompt (400):**

```json
{
  "error": "Prompt contains prohibited content",
  "code": "INVALID_PROMPT",
  "details": {
    "reason": "content_policy_violation",
    "field": "prompt"
  }
}
```

---

## 🚦 **Rate Limiting**

### Limits by User Type

| User Type  | Images/min | Videos/min | API Calls/min |
| ---------- | ---------- | ---------- | ------------- |
| Free       | 3          | 1          | 60            |
| Pro        | 10         | 5          | 300           |
| Enterprise | Unlimited  | Unlimited  | 1000          |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704067800
X-RateLimit-Window: 60
```

### Rate Limit Response

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 60,
    "window": "60 seconds",
    "retryAfter": 30
  }
}
```

---

## 💻 **SDK Examples**

### JavaScript/TypeScript

```typescript
class CraftFrameAPI {
  private baseURL: string;
  private token: string;

  constructor(token: string, baseURL = "https://api.craftframe.com") {
    this.token = token;
    this.baseURL = baseURL;
  }

  async generateImage(params: {
    prompt: string;
    model?: string;
    category?: string;
    steps?: number;
    cfg_scale?: number;
  }) {
    const response = await fetch(`${this.baseURL}/studio/generate-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getGenerationStatus(id: string) {
    const response = await fetch(`${this.baseURL}/studio/generation/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return response.json();
  }

  async waitForCompletion(id: string, timeout = 120000): Promise<any> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.getGenerationStatus(id);

      if (status.status === "completed") {
        return status;
      } else if (status.status === "failed") {
        throw new Error(`Generation failed: ${status.error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    throw new Error("Generation timeout");
  }
}

// Usage Example
const api = new CraftFrameAPI("your-jwt-token");

async function generateAndWait() {
  try {
    // Start generation
    const generation = await api.generateImage({
      prompt: "A beautiful sunset over mountains",
      model: "flux-pro",
      category: "photorealistic",
      steps: 30,
    });

    console.log("Generation started:", generation.id);

    // Wait for completion
    const result = await api.waitForCompletion(generation.id);
    console.log("Image URL:", result.url);
  } catch (error) {
    console.error("Generation failed:", error);
  }
}
```

### Python

```python
import requests
import time
from typing import Optional, Dict, Any

class CraftFrameAPI:
    def __init__(self, token: str, base_url: str = "https://api.craftframe.com"):
        self.token = token
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def generate_image(self,
                      prompt: str,
                      model: Optional[str] = None,
                      category: Optional[str] = None,
                      steps: Optional[int] = None,
                      cfg_scale: Optional[float] = None) -> Dict[str, Any]:

        data = {"prompt": prompt}
        if model: data["model"] = model
        if category: data["category"] = category
        if steps: data["steps"] = steps
        if cfg_scale: data["cfg_scale"] = cfg_scale

        response = requests.post(
            f"{self.base_url}/studio/generate-image",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()

    def get_generation_status(self, generation_id: str) -> Dict[str, Any]:
        response = requests.get(
            f"{self.base_url}/studio/generation/{generation_id}",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def wait_for_completion(self, generation_id: str, timeout: int = 120) -> Dict[str, Any]:
        start_time = time.time()

        while time.time() - start_time < timeout:
            status = self.get_generation_status(generation_id)

            if status["status"] == "completed":
                return status
            elif status["status"] == "failed":
                raise Exception(f"Generation failed: {status.get('error')}")

            time.sleep(3)

        raise TimeoutError("Generation timeout")

# Usage Example
api = CraftFrameAPI("your-jwt-token")

try:
    # Start generation
    generation = api.generate_image(
        prompt="A beautiful sunset over mountains",
        model="flux-pro",
        category="photorealistic",
        steps=30
    )

    print(f"Generation started: {generation['id']}")

    # Wait for completion
    result = api.wait_for_completion(generation["id"])
    print(f"Image URL: {result['url']}")

except Exception as e:
    print(f"Generation failed: {e}")
```

### cURL Examples

**Login:**

```bash
curl -X POST https://api.craftframe.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

**Generate Image:**

```bash
curl -X POST https://api.craftframe.com/studio/generate-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "model": "flux-pro",
    "category": "photorealistic",
    "steps": 30,
    "cfg_scale": 7.5
  }'
```

**Check Status:**

```bash
curl -X GET https://api.craftframe.com/studio/generation/img_1704067200_abc123def \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔄 **Webhooks** (Coming Soon)

### Webhook Configuration

Configure webhooks to receive notifications when generations complete.

**Endpoint:** `POST /webhooks/configure`

```json
{
  "url": "https://your-app.com/webhook",
  "events": ["generation.completed", "generation.failed"],
  "secret": "your-webhook-secret"
}
```

### Webhook Payload

```json
{
  "event": "generation.completed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "id": "img_1704067200_abc123def",
    "userId": "user-uuid",
    "type": "image",
    "status": "completed",
    "url": "https://craftframe.com/generated/image.jpg",
    "metadata": {
      "model": "flux-pro",
      "credits_used": 4
    }
  }
}
```

---

## 📞 **Support**

### API Support

- **Email**: api-support@craftframe.com
- **Documentation**: https://docs.craftframe.com
- **Status Page**: https://status.craftframe.com

### Rate Limit Increases

Contact support for higher rate limits or custom enterprise solutions.

---

This completes the CraftFrame API reference. For more examples and tutorials, visit our [documentation site](https://docs.craftframe.com).
