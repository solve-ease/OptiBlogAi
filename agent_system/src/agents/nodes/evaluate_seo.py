# """SEO evaluation node implementation."""

# import json
# import re
# from typing import Dict, Any
# from src.schemas.state import GraphState
# from src.tools.gemini_client import get_gemini_client
# from src.utils.logger import get_logger

# logger = get_logger(__name__)


# async def evaluate_seo(state: GraphState) -> Dict[str, Any]:
#     """Evaluate SEO quality of the generated blog content.
    
#     Args:
#         state: Current graph state containing draft_blog and keyword
        
#     Returns:
#         Updated state with seo_scores and final_score
#     """
#     draft_blog = state.draft_blog
#     keyword = state.keyword
    
#     if not draft_blog:
#         logger.warning("No draft blog content to evaluate")
#         return {
#             "seo_scores": {},
#             "final_score": 0.0
#         }
    
#     logger.info("Starting SEO evaluation", keyword=keyword)
    
#     try:
#         # Load SEO evaluation prompt template
#         with open("src/agents/prompts/seo_eval_prompt.txt", "r") as f:
#             seo_prompt_template = f.read()
        
#         # Format prompt with content and keyword
#         seo_prompt = seo_prompt_template.format(
#             blog_content=draft_blog,
#             keyword=keyword
#         )
        
#         # Get evaluation from Gemini
#         gemini_client = await get_gemini_client()
        
#         evaluation_response = await gemini_client.generate_content(
#             prompt=seo_prompt,
#             temperature=0.1  # Lower temperature for more consistent evaluation
#         )
        
#         # Parse JSON response
#         seo_scores = _parse_seo_evaluation(evaluation_response)
        
#         # Add deterministic rule-based evaluation
#         rule_based_scores = _evaluate_with_rules(draft_blog, keyword)
        
#         # Combine AI and rule-based scores (weighted average)
#         final_scores = _combine_scores(seo_scores, rule_based_scores)
        
#         final_score = final_scores.get("final_score", 0.0)
        
#         logger.info(
#             "SEO evaluation completed",
#             keyword=keyword,
#             final_score=final_score,
#             ai_score=seo_scores.get("final_score", 0),
#             rule_score=rule_based_scores.get("final_score", 0)
#         )
        
#         return {
#             "seo_scores": final_scores,
#             "final_score": final_score
#         }
        
#     except Exception as e:
#         logger.error(
#             "SEO evaluation failed",
#             keyword=keyword,
#             error=str(e)
#         )
        
#         # Fallback to rule-based evaluation only
#         rule_based_scores = _evaluate_with_rules(draft_blog, keyword)
#         final_score = rule_based_scores.get("final_score", 0.0)
        
#         return {
#             "seo_scores": rule_based_scores,
#             "final_score": final_score
#         }


# def _parse_seo_evaluation(response: str) -> Dict[str, Any]:
#     """Parse SEO evaluation response from Gemini.
    
#     Args:
#         response: Raw response from Gemini
        
#     Returns:
#         Parsed SEO scores dictionary
#     """
#     try:
#         # Look for JSON content in the response
#         json_match = re.search(r'```json\s*(\{.*?\})\s*```', response, re.DOTALL)
        
#         if json_match:
#             json_content = json_match.group(1)
#             scores = json.loads(json_content)
            
#             # Validate required fields
#             required_fields = [
#                 "title_score", "meta_description_score", "keyword_optimization_score",
#                 "content_structure_score", "readability_score", "content_quality_score",
#                 "technical_seo_score", "final_score"
#             ]
            
#             for field in required_fields:
#                 if field not in scores:
#                     scores[field] = 0.0
                    
#             return scores
#         else:
#             logger.warning("No JSON found in SEO evaluation response")
#             return {}
            
#     except json.JSONDecodeError as e:
#         logger.error("Failed to parse SEO evaluation JSON", error=str(e))
#         return {}
#     except Exception as e:
#         logger.error("Unexpected error parsing SEO evaluation", error=str(e))
#         return {}


# def _evaluate_with_rules(content: str, keyword: str) -> Dict[str, Any]:
#     """Evaluate content using deterministic rules.
    
#     Args:
#         content: Blog content to evaluate
#         keyword: Target keyword
        
#     Returns:
#         Rule-based SEO scores
#     """
#     scores = {}
    
#     # Title evaluation
#     title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
#     if title_match:
#         title = title_match.group(1)
#         title_score = 0
        
#         if keyword.lower() in title.lower():
#             title_score += 40
#         if 30 <= len(title) <= 60:
#             title_score += 30
#         if len(title) > 0:
#             title_score += 30
            
#         scores["title_score"] = min(title_score, 100)
#     else:
#         scores["title_score"] = 0
    
#     # Meta description evaluation
#     meta_match = re.search(r'<meta name="description" content="(.*?)"', content, re.IGNORECASE)
#     if meta_match:
#         meta_desc = meta_match.group(1)
#         meta_score = 0
        
#         if keyword.lower() in meta_desc.lower():
#             meta_score += 40
#         if 120 <= len(meta_desc) <= 160:
#             meta_score += 40
#         if len(meta_desc) > 0:
#             meta_score += 20
            
#         scores["meta_description_score"] = min(meta_score, 100)
#     else:
#         scores["meta_description_score"] = 0
    
#     # Keyword density evaluation
#     content_text = re.sub(r'<[^>]+>', '', content)  # Strip HTML
#     word_count = len(content_text.split())
#     keyword_occurrences = len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', content_text.lower()))
    
#     if word_count > 0:
#         keyword_density = (keyword_occurrences / word_count) * 100
        
#         if 1.0 <= keyword_density <= 2.5:
#             scores["keyword_optimization_score"] = 100
#         elif 0.5 <= keyword_density < 1.0 or 2.5 < keyword_density <= 3.5:
#             scores["keyword_optimization_score"] = 80
#         elif keyword_density > 0:
#             scores["keyword_optimization_score"] = 60
#         else:
#             scores["keyword_optimization_score"] = 0
#     else:
#         scores["keyword_optimization_score"] = 0
    
#     # Content structure evaluation
#     h1_count = len(re.findall(r'<h1[^>]*>', content, re.IGNORECASE))
#     h2_count = len(re.findall(r'<h2[^>]*>', content, re.IGNORECASE))
#     h3_count = len(re.findall(r'<h3[^>]*>', content, re.IGNORECASE))
#     p_count = len(re.findall(r'<p[^>]*>', content, re.IGNORECASE))
    
#     structure_score = 0
#     if h1_count == 1:
#         structure_score += 25
#     if h2_count >= 3:
#         structure_score += 25
#     if h3_count >= 2:
#         structure_score += 25
#     if p_count >= 5:
#         structure_score += 25
        
#     scores["content_structure_score"] = structure_score
    
#     # Content length evaluation
#     if word_count >= 1200:
#         length_score = 100
#     elif word_count >= 800:
#         length_score = 80
#     elif word_count >= 500:
#         length_score = 60
#     else:
#         length_score = 40
        
#     scores["content_quality_score"] = length_score
    
#     # Readability (simplified - based on average sentence length)
#     sentences = re.split(r'[.!?]+', content_text)
#     if len(sentences) > 1:
#         avg_sentence_length = word_count / len(sentences)
#         if 15 <= avg_sentence_length <= 20:
#             readability_score = 100
#         elif 10 <= avg_sentence_length < 15 or 20 < avg_sentence_length <= 25:
#             readability_score = 80
#         else:
#             readability_score = 60
#     else:
#         readability_score = 60
        
#     scores["readability_score"] = readability_score
    
#     # Technical SEO (basic checks)
#     tech_score = 0
#     if '<title>' in content and '</title>' in content:
#         tech_score += 20
#     if 'meta name="description"' in content:
#         tech_score += 20
#     if '<h1' in content:
#         tech_score += 20
#     if '<h2' in content:
#         tech_score += 20
#     if word_count >= 1000:
#         tech_score += 20
        
#     scores["technical_seo_score"] = tech_score
    
#     # Calculate weighted final score
#     weights = {
#         "title_score": 0.15,
#         "meta_description_score": 0.10,
#         "keyword_optimization_score": 0.20,
#         "content_structure_score": 0.15,
#         "readability_score": 0.15,
#         "content_quality_score": 0.15,
#         "technical_seo_score": 0.10
#     }
    
#     final_score = sum(scores[key] * weights[key] for key in weights.keys())
#     scores["final_score"] = round(final_score, 1)
    
#     return scores


# def _combine_scores(ai_scores: Dict[str, Any], rule_scores: Dict[str, Any]) -> Dict[str, Any]:
#     """Combine AI and rule-based scores with weighted average.
    
#     Args:
#         ai_scores: Scores from AI evaluation
#         rule_scores: Scores from rule-based evaluation
        
#     Returns:
#         Combined scores dictionary
#     """
#     combined = {}
#     ai_weight = 0.4
#     rule_weight = 0.6
    
#     score_keys = [
#         "title_score", "meta_description_score", "keyword_optimization_score",
#         "content_structure_score", "readability_score", "content_quality_score",
#         "technical_seo_score"
#     ]
    
#     for key in score_keys:
#         ai_score = ai_scores.get(key, 0)
#         rule_score = rule_scores.get(key, 0)
#         combined[key] = round(ai_score * ai_weight + rule_score * rule_weight, 1)
    
#     # Calculate final score
#     weights = {
#         "title_score": 0.15,
#         "meta_description_score": 0.10,
#         "keyword_optimization_score": 0.20,
#         "content_structure_score": 0.15,
#         "readability_score": 0.15,
#         "content_quality_score": 0.15,
#         "technical_seo_score": 0.10
#     }
    
#     final_score = sum(combined[key] * weights[key] for key in weights.keys())
#     combined["final_score"] = round(final_score, 1)
    
#     # Add feedback if available
#     if "feedback" in ai_scores:
#         combined["feedback"] = ai_scores["feedback"]
    
#     return combined



"""SEO evaluation node implementation - Fixed JSON parsing."""

import json
import re
from typing import Dict, Any
from src.schemas.state import GraphState
from src.tools.gemini_client import get_gemini_client
from src.utils.logger import get_logger

logger = get_logger(__name__)


async def evaluate_seo(state: GraphState) -> Dict[str, Any]:
    """Evaluate SEO quality of the generated blog content."""
    draft_blog = state.draft_blog
    keyword = state.keyword
    
    if not draft_blog:
        logger.warning("No draft blog content to evaluate")
        return {
            "seo_scores": {},
            "final_score": 0.0
        }
    
    logger.info("Starting SEO evaluation", keyword=keyword)
    
    try:
        # Use rule-based evaluation as primary method (more reliable)
        rule_based_scores = _evaluate_with_rules(draft_blog, keyword)
        
        # Try AI evaluation as enhancement (if API key available)
        ai_scores = {}
        try:
            gemini_client = await get_gemini_client()
            
            seo_prompt = f"""
            Evaluate this blog content for SEO quality. Return ONLY a JSON object with these exact fields:
            {{
                "title_score": <number 0-100>,
                "meta_description_score": <number 0-100>,
                "keyword_optimization_score": <number 0-100>,
                "content_structure_score": <number 0-100>,
                "readability_score": <number 0-100>,
                "content_quality_score": <number 0-100>,
                "technical_seo_score": <number 0-100>,
                "final_score": <number 0-100>
            }}

            Blog content to evaluate:
            {draft_blog[:2000]}...

            Target keyword: {keyword}
            
            Respond with ONLY the JSON object, no additional text.
            """
            
            evaluation_response = await gemini_client.generate_content(
                prompt=seo_prompt,
                temperature=0.1
            )
            
            # Parse AI evaluation
            ai_scores = _parse_seo_evaluation(evaluation_response)
            
        except Exception as e:
            logger.warning("AI SEO evaluation failed, using rule-based only", error=str(e))
        
        # Combine scores (prefer rule-based if AI fails)
        if ai_scores:
            final_scores = _combine_scores(ai_scores, rule_based_scores)
        else:
            final_scores = rule_based_scores
        
        final_score = final_scores.get("final_score", 0.0)
        
        logger.info(
            "SEO evaluation completed",
            keyword=keyword,
            final_score=final_score,
            method="combined" if ai_scores else "rule_based"
        )
        
        return {
            "seo_scores": final_scores,
            "final_score": final_score
        }
        
    except Exception as e:
        logger.error(
            "SEO evaluation failed",
            keyword=keyword,
            error=str(e)
        )
        
        # Fallback to basic rule evaluation
        basic_score = min(50.0 + (len(draft_blog) / 100), 80.0)
        
        return {
            "seo_scores": {"final_score": basic_score},
            "final_score": basic_score
        }


def _parse_seo_evaluation(response: str) -> Dict[str, Any]:
    """Parse SEO evaluation response from Gemini."""
    try:
        # Clean the response
        cleaned_response = response.strip()
        
        # Look for JSON content between ```json blocks
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', cleaned_response, re.DOTALL)
        if json_match:
            json_content = json_match.group(1)
        else:
            # Look for direct JSON object
            json_match = re.search(r'\{[^}]*"final_score"[^}]*\}', cleaned_response, re.DOTALL)
            if json_match:
                json_content = json_match.group(0)
            else:
                # Try to parse the entire response as JSON
                json_content = cleaned_response
        
        # Parse JSON
        scores = json.loads(json_content)
        
        # Validate and sanitize scores
        required_fields = [
            "title_score", "meta_description_score", "keyword_optimization_score",
            "content_structure_score", "readability_score", "content_quality_score",
            "technical_seo_score", "final_score"
        ]
        
        for field in required_fields:
            if field not in scores:
                scores[field] = 0.0
            else:
                # Ensure numeric and within bounds
                try:
                    scores[field] = max(0.0, min(100.0, float(scores[field])))
                except (ValueError, TypeError):
                    scores[field] = 0.0
                    
        return scores
        
    except json.JSONDecodeError as e:
        logger.warning("Failed to parse JSON from SEO evaluation", error=str(e))
        return {}
    except Exception as e:
        logger.error("Unexpected error parsing SEO evaluation", error=str(e))
        return {}


def _evaluate_with_rules(content: str, keyword: str) -> Dict[str, Any]:
    """Evaluate content using deterministic rules."""
    scores = {}
    
    # Title evaluation
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    if title_match:
        title = title_match.group(1)
        title_score = 0
        
        if keyword.lower() in title.lower():
            title_score += 40
        if 30 <= len(title) <= 60:
            title_score += 30
        if len(title) > 0:
            title_score += 30
            
        scores["title_score"] = min(title_score, 100)
    else:
        scores["title_score"] = 0
    
    # Meta description evaluation
    meta_match = re.search(r'<meta name="description" content="(.*?)"', content, re.IGNORECASE)
    if meta_match:
        meta_desc = meta_match.group(1)
        meta_score = 0
        
        if keyword.lower() in meta_desc.lower():
            meta_score += 40
        if 120 <= len(meta_desc) <= 160:
            meta_score += 40
        if len(meta_desc) > 0:
            meta_score += 20
            
        scores["meta_description_score"] = min(meta_score, 100)
    else:
        scores["meta_description_score"] = 0
    
    # Keyword density evaluation
    content_text = re.sub(r'<[^>]+>', '', content)  # Strip HTML
    word_count = len(content_text.split())
    keyword_occurrences = len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', content_text.lower()))
    
    if word_count > 0:
        keyword_density = (keyword_occurrences / word_count) * 100
        
        if 1.0 <= keyword_density <= 2.5:
            scores["keyword_optimization_score"] = 100
        elif 0.5 <= keyword_density < 1.0 or 2.5 < keyword_density <= 3.5:
            scores["keyword_optimization_score"] = 80
        elif keyword_density > 0:
            scores["keyword_optimization_score"] = 60
        else:
            scores["keyword_optimization_score"] = 0
    else:
        scores["keyword_optimization_score"] = 0
    
    # Content structure evaluation
    h1_count = len(re.findall(r'<h1[^>]*>', content, re.IGNORECASE))
    h2_count = len(re.findall(r'<h2[^>]*>', content, re.IGNORECASE))
    h3_count = len(re.findall(r'<h3[^>]*>', content, re.IGNORECASE))
    p_count = len(re.findall(r'<p[^>]*>', content, re.IGNORECASE))
    
    structure_score = 0
    if h1_count == 1:
        structure_score += 25
    if h2_count >= 3:
        structure_score += 25
    if h3_count >= 2:
        structure_score += 25
    if p_count >= 5:
        structure_score += 25
        
    scores["content_structure_score"] = structure_score
    
    # Content length evaluation
    if word_count >= 1200:
        length_score = 100
    elif word_count >= 800:
        length_score = 80
    elif word_count >= 500:
        length_score = 60
    else:
        length_score = 40
        
    scores["content_quality_score"] = length_score
    
    # Readability (simplified - based on average sentence length)
    sentences = re.split(r'[.!?]+', content_text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) > 1:
        avg_sentence_length = word_count / len(sentences)
        if 15 <= avg_sentence_length <= 20:
            readability_score = 100
        elif 10 <= avg_sentence_length < 15 or 20 < avg_sentence_length <= 25:
            readability_score = 80
        else:
            readability_score = 60
    else:
        readability_score = 60
        
    scores["readability_score"] = readability_score
    
    # Technical SEO (basic checks)
    tech_score = 0
    if '<title>' in content and '</title>' in content:
        tech_score += 20
    if 'meta name="description"' in content:
        tech_score += 20
    if '<h1' in content:
        tech_score += 20
    if '<h2' in content:
        tech_score += 20
    if word_count >= 1000:
        tech_score += 20
        
    scores["technical_seo_score"] = tech_score
    
    # Calculate weighted final score
    weights = {
        "title_score": 0.15,
        "meta_description_score": 0.10,
        "keyword_optimization_score": 0.20,
        "content_structure_score": 0.15,
        "readability_score": 0.15,
        "content_quality_score": 0.15,
        "technical_seo_score": 0.10
    }
    
    final_score = sum(scores.get(key, 0) * weights[key] for key in weights.keys())
    scores["final_score"] = round(final_score, 1)
    
    return scores


def _combine_scores(ai_scores: Dict[str, Any], rule_scores: Dict[str, Any]) -> Dict[str, Any]:
    """Combine AI and rule-based scores with weighted average."""
    combined = {}
    ai_weight = 0.3
    rule_weight = 0.7
    
    score_keys = [
        "title_score", "meta_description_score", "keyword_optimization_score",
        "content_structure_score", "readability_score", "content_quality_score",
        "technical_seo_score"
    ]
    
    for key in score_keys:
        ai_score = ai_scores.get(key, 0)
        rule_score = rule_scores.get(key, 0)
        combined[key] = round(ai_score * ai_weight + rule_score * rule_weight, 1)
    
    # Calculate final score
    weights = {
        "title_score": 0.15,
        "meta_description_score": 0.10,
        "keyword_optimization_score": 0.20,
        "content_structure_score": 0.15,
        "readability_score": 0.15,
        "content_quality_score": 0.15,
        "technical_seo_score": 0.10
    }
    
    final_score = sum(combined[key] * weights[key] for key in weights.keys())
    combined["final_score"] = round(final_score, 1)
    
    return combined