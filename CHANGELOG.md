# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2024-9-26

### Fixed

- Modified JUnit format data formatting process
  - If no test cycle name is specified, the action execution date and time (UTC) is now used instead.

### Changed

- Added processing to handle multiple file paths
  - Data formatting is performed for each file path, and then all data is combined and synced into the QualityForward automated test stability report.

## [1.0.0] - 2024-9-20

- Initial Release of the Automated Test Stability Report Sync Action
