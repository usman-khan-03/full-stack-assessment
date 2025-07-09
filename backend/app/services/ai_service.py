from openai import OpenAI
import os
import requests
import base64

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def safe_extract(prefix: str, lines: list[str]) -> str:
    for line in lines:
        normalized_line = line.lower().strip()
        if prefix in normalized_line:
            parts = line.split(":", 1)
            if len(parts) > 1:
                value = parts[1].strip()
                return value.lstrip("* ").strip()
    return ""

def generate_metadata(image_url: str) -> dict:
    print("[AI] Downloading image...")
    img_bytes = requests.get(image_url).content
    print("[AI] Encoding image...")
    b64_image = base64.b64encode(img_bytes).decode('utf-8')

    print("[AI] Sending to OpenAI...")
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "You're an e-commerce AI assistant. Given the image below, generate the following **in this exact format**:\n\n"
                            "**Title:** <a clear, marketable product title>\n"
                            "**Description:** <a compelling product description>\n"
                            "**Keywords:** <a comma-separated list of SEO keywords>\n\n"
                            "Only return those three lines. No preamble, no explanations, no bullet points."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{b64_image}"
                        }
                    }
                ],
            }
        ],
        max_tokens=500
    )

    print("[AI] Parsing OpenAI response...")
    content = response.choices[0].message.content
    print("[AI] Raw GPT output:", content)

    # Normalize and parse the content
    if content is None:
        raise ValueError("OpenAI response did not contain any content.")
    lines = content.strip().split("\n")

    title = safe_extract("title", lines)
    description = safe_extract("description", lines)
    keywords_line = safe_extract("keyword", lines)
    keywords = [kw.lstrip("* ").strip() for kw in keywords_line.split(",") if kw.strip()]

    parsed = {
        "title": title,
        "description": description,
        "keywords": keywords
    }

    print("[AI] Parsed result:", parsed)
    return parsed
