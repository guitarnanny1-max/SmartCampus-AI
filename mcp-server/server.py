import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from mcp.server.mcpserver import MCPServer

server = MCPServer("SmartCampusAI")

DEV_CONTEXT_URL = "http://localhost:3000/api/mcp/dev-context"


def get_authenticated_context() -> dict:
    """
    Development authentication boundary.

    The MCP client never supplies tenant_id or user_id.
    The Next.js server resolves the configured development identity
    after validating MCP_DEV_SECRET.

    Production must replace this mechanism with MCP OAuth 2.1 /
    authenticated MCP session context.
    """
    if os.getenv("NODE_ENV") == "production":
        return {
            "authenticated": False,
            "tenant_id": None,
            "user_id": None,
            "role": None,
            "environment": "production",
            "error": "Development MCP authentication is disabled in production",
        }

    secret = os.getenv("MCP_DEV_SECRET")

    if not secret:
        return {
            "authenticated": False,
            "tenant_id": None,
            "user_id": None,
            "role": None,
            "environment": "development",
            "error": "MCP_DEV_SECRET is not configured",
        }

    request = Request(
        DEV_CONTEXT_URL,
        headers={
            "Authorization": f"Bearer {secret}",
            "Accept": "application/json",
        },
        method="GET",
    )

    try:
        with urlopen(request, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))

        if not payload.get("success"):
            return {
                "authenticated": False,
                "tenant_id": None,
                "user_id": None,
                "role": None,
                "environment": "development",
                "error": payload.get("error", "Authentication failed"),
            }

        user = payload.get("user", {})
        tenant = payload.get("tenant", {})

        return {
            "authenticated": True,
            "tenant_id": tenant.get("id"),
            "tenant_name": tenant.get("name"),
            "subdomain": tenant.get("subdomain"),
            "user_id": user.get("id"),
            "user_name": user.get("name"),
            "user_email": user.get("email"),
            "role": user.get("role"),
            "environment": payload.get("environment", "development"),
        }

    except HTTPError as exc:
        return {
            "authenticated": False,
            "tenant_id": None,
            "user_id": None,
            "role": None,
            "environment": "development",
            "error": f"Authentication endpoint returned HTTP {exc.code}",
        }

    except URLError:
        return {
            "authenticated": False,
            "tenant_id": None,
            "user_id": None,
            "role": None,
            "environment": "development",
            "error": "SmartCampusAI Next.js server is not reachable",
        }

    except Exception:
        return {
            "authenticated": False,
            "tenant_id": None,
            "user_id": None,
            "role": None,
            "environment": "development",
            "error": "MCP authentication request failed",
        }


@server.tool()
def health_check() -> str:
    """Check whether the SmartCampusAI MCP server is running."""
    return "SmartCampusAI MCP server is healthy."


@server.tool()
def tenant_context() -> dict:
    """Return the authenticated MCP identity and tenant context."""
    return get_authenticated_context()


@server.tool()
def get_my_students() -> dict:
    """
    Return students authorized for the authenticated user.

    Student data access will be connected to the server-side
    authorization layer in the next step.
    """
    context = get_authenticated_context()

    if not context["authenticated"]:
        return {
            "success": False,
            "error": context.get("error", "MCP authentication required"),
            "students": [],
        }

    return {
        "success": True,
        "students": [],
        "context": {
            "role": context["role"],
            "tenant_id": context["tenant_id"],
        },
    }


if __name__ == "__main__":
    server.run()
