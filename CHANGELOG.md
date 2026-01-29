# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2026-01-29

### Added
- API key UI enhancement
- Telegram notification integration
- Sidebar state persistence in localStorage

### Changed
- Package renamed from "tan-app" to "tanstack-template"

### Fixed
- Resolved MCP tool error by downgrading Zod to v3
- Updated MCPTool handler type to match MCP SDK signature
- Fixed MCPTool interface with correct inputSchema types from MCP SDK

### Refactored
- Separated MCP tools into categorized folders

## [0.0.1-0] - 2026-01-29

### Initial pre-release
- Initial setup with TanStack Router, Query, and Mantine UI
- Basic authentication with Better Auth
- PostgreSQL database with Prisma ORM
- ElysiaJS backend with Nitro
- MCP (Model Context Protocol) integration