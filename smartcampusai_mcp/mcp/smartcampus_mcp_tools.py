import asyncio
import json
import os
from typing import Any, Dict, List

import httpx

BASE_URL = os.getenv("SMARTCAMPUS_BASE_URL", "http://localhost:3000")
API_TOKEN = os.getenv("SMARTCAMPUS_API_TOKEN") or os.getenv("MCP_DEV_SECRET")


def _empty_result(message: str = "No data available") -> Dict[str, Any]:
    return {"success": False, "error": message, "data": []}


async def _request_json(path: str, timeout: float = 10.0) -> Dict[str, Any]:
    if not API_TOKEN:
        return {"success": False, "error": "MCP API token not configured", "data": []}

    url = f"{BASE_URL.rstrip('/')}{path}"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(url, headers=headers)
            if response.status_code >= 400:
                try:
                    payload = response.json()
                except Exception:
                    payload = {"error": response.text}
                return {"success": False, "error": payload.get("error", "Request failed"), "data": []}
            return response.json()
    except Exception as exc:  # pragma: no cover
        return {"success": False, "error": str(exc), "data": []}


async def get_my_students() -> Dict[str, Any]:
    payload = await _request_json("/api/parent-students")
    if not payload.get("success"):
        return _empty_result(payload.get("error", "Unable to load students"))
    students = payload.get("students") or []
    return {"success": True, "students": students, "count": len(students)}


async def get_student_attendance(student_id: str | None = None) -> Dict[str, Any]:
    if not student_id:
        return _empty_result("student_id is required")
    payload = await _request_json(f"/api/parent-students")
    if not payload.get("success"):
        return _empty_result(payload.get("error", "Unable to load attendance"))

    students = payload.get("students") or []
    match = next((item for item in students if item.get("student", {}).get("id") == student_id), None)
    if not match:
        return {"success": True, "studentId": student_id, "attendance": []}
    return {"success": True, "studentId": student_id, "attendance": match.get("attendance", {}).get("recent", [])}


async def get_student_fees(student_id: str | None = None) -> Dict[str, Any]:
    if not student_id:
        return _empty_result("student_id is required")
    payload = await _request_json("/api/parent-students")
    if not payload.get("success"):
        return _empty_result(payload.get("error", "Unable to load fees"))

    students = payload.get("students") or []
    match = next((item for item in students if item.get("student", {}).get("id") == student_id), None)
    if not match:
        return {"success": True, "studentId": student_id, "fees": []}
    return {"success": True, "studentId": student_id, "fees": match.get("fees", {}).get("records", [])}


async def get_student_timetable(student_id: str | None = None) -> Dict[str, Any]:
    if not student_id:
        return _empty_result("student_id is required")
    return {"success": True, "studentId": student_id, "timetable": []}


async def get_school_announcements() -> Dict[str, Any]:
    payload = await _request_json("/api/announcements")
    if not payload.get("success"):
        return _empty_result(payload.get("error", "Unable to load announcements"))
    announcements = payload.get("announcements") or payload.get("data") or []
    return {"success": True, "announcements": announcements}


async def get_my_messages(student_id: str | None = None) -> Dict[str, Any]:
    path = "/api/messages"
    if student_id:
        path = f"/api/messages?studentId={student_id}"
    payload = await _request_json(path)
    if not payload.get("success"):
        return _empty_result(payload.get("error", "Unable to load messages"))
    messages = payload.get("messages") or []
    return {"success": True, "messages": messages, "count": len(messages)}


async def _demo() -> None:
    students = await get_my_students()
    print(f"Found {students.get('count', 0)} student(s)")
    print(f"Announcements: {len((await get_school_announcements()).get('announcements', []))}")


if __name__ == "__main__":
    asyncio.run(_demo())
