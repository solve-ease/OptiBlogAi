import asyncio
from src.agents.graph import get_blog_generation_graph

async def smoke():
    g = await get_blog_generation_graph()
    result = await g.run_blog_generation("AI trends 2025")
    print("✅ SUCCESS" if result["success"] else "❌ FAILED", result["final_score"])

asyncio.run(smoke())