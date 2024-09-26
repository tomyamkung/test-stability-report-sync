# Automated Test Stability Report Sync Action

This action integrates automated test results into the QualityForward Automated Test Stability Report.

![alt](./AutoTestResult_StabilityReport.png)

## Inputs

### `api_key`

**Required**: Set the project API key for Quality Forward. <br> Be sure to use  [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) to configure it. <br>Please refer to the [APIキーの発行手順](https://qualityforward.github.io/api-spec/#section/API/API) in the QualityForward API documentation for instructions on how to set up the API key.

### `file-path`

**Required**: Please configure the file path where the results of the automated tests are stored.

### `test-framework`

**Required**: Please configure the test framework used. It can be specified with a wildcard.

Supported Test Frameworks:

|Test Framework|File Extension|
|:--:|:--:|
|junit|xml|
|pytest|xml|
|nodejs-playwright|xml|
|pytest-playwright|xml|
|magicpod|json|

※ For other test frameworks that can output files in junit-xml format, set it to junit.

### `auto_test_suite_external_key`

Please configure the name of the automated test suite to be integrated.

Default automated test suite name if not specified:

|Test Framework|Default Automated Test Suite Name|
|:--:|:--|
|junit,nodejs-playwright|The name attribute of the testsuite element|
|pytest,pytest-playwright|The classname attribute of the testcase element<br>Taking the part after the last dot.<br>(Example) if test.testSuite, it fetches “testSuite”.|
|magicpod|Bulk Execution Setting Name for Tests|

### `auto_test_cycle_name`

Please set the automated test cycle name to integrate.

Default automated test cycle name if not specified:

|Test Framework|Default Automated Test Cycle Name|Example|
|:--:|:--|:--|
|junit|Action Execution Date and Time|9/26/2024, 4:10:10 AM|
|pytest,nodejs-playwright,pytest-playwright|timestamp attribute of the testsuite element|2024-08-28T15:12:57.311996+09:00|
|magicpod|End time of bulk test execution|2024-05-09T02:44:32Z|

### `auto_execution_device_external_key`

Please set the automated test execution environment name to integrate.

Default automated test execution environment name if not specified:

|Test Framework|Default Automated Test Execution Environment Name|
|:--:|:--|
|junit,pytest,magicpod|`Standard environment`|
|nodejs-playwright|hostname attribute of the testsuite element|
|pytest-playwright|Extracted from the name attribute of the testcase element. <br>(Example) if test_sample[chromium-data-driven], it fetches “chromium”|

## Example usage

### When specifying a specific file

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4 

  - name: Run tests
    run: pytest tests/ --junitxml=result.xml 

  - name: link Automated Test Results
    uses: QualityForward/test-stability-report-sync@v1.0.0
    with:
      file-path: result.xml
      test-framework: pytest-playwright
      api-key: ${{ secrets.API_KEY }}
```

### When specifying all files stored in a specific folder

※Limited to the same test framework

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4 

  - name: Run tests
    run: pytest tests/ --junitxml=result.xml 

  - name: link Automated Test Results
    uses: QualityForward/test-stability-report-sync@v1.0.0
    with:
      file-path: results/*.xml
      test-framework: junit
      api-key: ${{ secrets.API_KEY }}
      auto_execution_device_external_key: chrome
```
