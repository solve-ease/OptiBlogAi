# Contributing to OptiBlogAi

Thank you for your interest in contributing to OptiBlogAi! We welcome contributions from developers of all skill levels. This guide will help you get started and ensure your contributions align with our project standards.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Community and Support](#community-and-support)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Python 3.10 or higher
- Git
- A GitHub account
- Basic understanding of AI/ML concepts (helpful but not required)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/OptiBlogAi.git
   cd OptiBlogAi
   ```

3. **Set up the development environment**:
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/MacOS
   venv\Scripts\activate     # Windows

   # Install dependencies
   pip install -r requirements.txt

   # Install Playwright browsers
   playwright install

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your API keys (see README.md for details)
   ```

4. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/solve-ease/OptiBlogAi.git
   ```

5. **Verify your setup**:
   ```bash
   python -m pytest tests/ -v
   python src/main.py --help
   ```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**: Help us identify and fix issues
- **Feature implementations**: Add new functionality
- **Documentation improvements**: Enhance our docs and guides
- **Performance optimizations**: Improve efficiency and speed
- **Test coverage**: Add or improve tests
- **Code refactoring**: Improve code quality and maintainability
- **Translation**: Help localize the project (future feature)

### Contribution Workflow

1. **Check existing issues** to see if your contribution is already being worked on
2. **Open an issue** to discuss major changes before implementing them
3. **Create a feature branch** from the main branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our code standards
5. **Write or update tests** for your changes
6. **Run the test suite** to ensure nothing is broken
7. **Update documentation** if necessary
8. **Commit your changes** with clear, descriptive messages
9. **Push to your fork** and **submit a pull request**

## Code Standards

### Python Code Style

We follow PEP 8 with some project-specific guidelines:

- **Code formatter**: We use Black for consistent formatting
- **Line length**: Maximum 88 characters (Black default)
- **Imports**: Use isort for import organization
- **Type hints**: Required for all public functions and methods
- **Docstrings**: Use Google-style docstrings for all public functions

### Code Quality Tools

Before submitting code, run these tools:

```bash
# Format code
black src/ tests/

# Sort imports
isort src/ tests/

# Check for common issues
flake8 src/ tests/

# Type checking (if mypy is configured)
mypy src/
```

### Naming Conventions

- **Variables and functions**: `snake_case`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private methods**: Prefix with single underscore `_private_method`
- **Modules**: Short, lowercase names

### Error Handling

- Use specific exception types rather than generic `Exception`
- Include meaningful error messages
- Use logging instead of print statements
- Handle edge cases gracefully

### AI/ML Specific Guidelines

- **Model outputs**: Always validate and sanitize LLM outputs
- **API keys**: Never commit API keys or sensitive data
- **Rate limiting**: Respect API rate limits and implement backoff strategies
- **Data privacy**: Follow data protection guidelines when processing content
- **Reproducibility**: Use random seeds where appropriate for testing

## Testing Guidelines

### Test Structure

- **Unit tests**: Located in `tests/unit/`
- **Integration tests**: Located in `tests/integration/`
- **Test naming**: `test_<functionality>_<scenario>.py`

### Writing Tests

```python
import pytest
from src.your_module import YourClass

class TestYourClass:
    def test_method_with_valid_input(self):
        """Test that method works correctly with valid input."""
        # Arrange
        instance = YourClass()
        
        # Act
        result = instance.method("valid_input")
        
        # Assert
        assert result == expected_value

    def test_method_with_invalid_input(self):
        """Test that method handles invalid input gracefully."""
        instance = YourClass()
        
        with pytest.raises(ValueError):
            instance.method("invalid_input")
```

### Test Requirements

- **Coverage**: Aim for >80% test coverage for new code
- **Mocking**: Mock external API calls and file operations
- **Fixtures**: Use pytest fixtures for common test data
- **Isolation**: Tests should not depend on each other
- **Performance**: Mark slow tests with `@pytest.mark.slow`

### Running Tests

```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=src tests/

# Run only unit tests
python -m pytest tests/unit/

# Run only integration tests
python -m pytest tests/integration/

# Run specific test file
python -m pytest tests/unit/test_content_processor.py
```

## Documentation Standards

### Code Documentation

- **Docstrings**: Required for all public functions, classes, and modules
- **Type hints**: Use for all function parameters and return values
- **Comments**: Explain why, not what (the code should be self-explanatory)

### Example Docstring

```python
def generate_blog_content(
    keyword: str, 
    max_length: int = 2000,
    seo_optimize: bool = True
) -> BlogContent:
    """Generate SEO-optimized blog content for a given keyword.
    
    Args:
        keyword: The target keyword for content generation
        max_length: Maximum length of generated content in characters
        seo_optimize: Whether to apply SEO optimization techniques
        
    Returns:
        BlogContent object containing the generated article
        
    Raises:
        ValueError: If keyword is empty or invalid
        APIError: If LLM service is unavailable
        
    Example:
        >>> content = generate_blog_content("machine learning", 1500)
        >>> print(content.title)
        "Understanding Machine Learning: A Comprehensive Guide"
    """
```

### Documentation Updates

- Update relevant documentation when adding features
- Include examples for new functionality
- Update the README.md if architectural changes are made
- Add or update API documentation for new endpoints

## Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run the full test suite**:
   ```bash
   python -m pytest
   ```

3. **Check code quality**:
   ```bash
   black --check src/ tests/
   flake8 src/ tests/
   ```

### Pull Request Guidelines

- **Title**: Clear, descriptive title (e.g., "Add support for custom LLM providers")
- **Description**: Explain what changes were made and why
- **Testing**: Describe how the changes were tested
- **Documentation**: Note any documentation updates
- **Breaking changes**: Clearly mark any breaking changes
- **Issue linking**: Reference related issues with "Closes #123"

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] New tests added for new functionality

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Review Process

1. **Automated checks**: CI/CD pipeline runs automatically
2. **Code review**: Maintainers review your code
3. **Feedback incorporation**: Address review comments
4. **Approval**: Changes are approved by maintainers
5. **Merge**: Pull request is merged into main branch

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Environment**: Python version, OS, relevant package versions
- **Steps to reproduce**: Clear, step-by-step instructions
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Error messages**: Full error messages and stack traces
- **Configuration**: Relevant configuration settings (sanitize sensitive data)

### Feature Requests

For feature requests, please include:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How would you like this implemented?
- **Alternatives considered**: Other approaches you've considered
- **Use case**: Specific examples of how this would be used
- **Priority**: How important is this feature to you?

### Security Issues

**Do not report security vulnerabilities through public GitHub issues.**

Please report security issues privately using our [Security Policy](SECURITY.md).

## Community and Support

### Getting Help

- **Documentation**: Check our [docs](docs/) directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code review**: Ask for review in your pull request

### Communication Guidelines

- **Be respectful**: Treat all community members with respect
- **Be patient**: Maintainers are volunteers with limited time
- **Be clear**: Provide clear, detailed information in issues and PRs
- **Be helpful**: Help other contributors when you can

### Recognition

Contributors are recognized in several ways:

- **Contributor list**: Added to project contributors
- **Release notes**: Significant contributions mentioned in releases
- **Community**: Recognition in community discussions

### Development Philosophy

OptiBlogAi follows these principles:

- **Quality over quantity**: Well-tested, maintainable code
- **Ethical AI**: Responsible AI practices and transparency
- **Open collaboration**: Inclusive, welcoming community
- **Continuous improvement**: Always learning and evolving

## Questions?

If you have questions about contributing, please:

1. Check this guide and existing documentation
2. Search existing GitHub issues and discussions
3. Open a new GitHub Discussion
4. Contact the maintainers directly for sensitive matters

Thank you for contributing to OptiBlogAi! 🚀

---

**Happy coding!** Together, we're building the future of AI-powered content creation.