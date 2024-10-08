# 自動テスト安定性レポート連携アクション

自動テスト結果を QualityForward の自動テスト安定性レポートに連携します。

![alt](./AutoTestResult_StabilityReport.png)

## 入力情報

### `api_key`

**必須項目** Quality Forward のプロジェクト API キーを設定してください。<br>必ず、[GitHub Actions でのシークレットの使用](https://docs.github.com/ja/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)を利用して、設定してください。<br>API キーの設定方法は QualityForward API の[API キーの発行手順](https://qualityforward.github.io/api-spec/#section/API/API)をご確認ください。

### `file-path`

**必須項目** 自動テストの実行結果を格納したファイルパスを設定してください。ワイルドカードで指定可能です。

### `test-framework`

**必須項目** 使用したテストフレームワークを設定してください。

設定できるテストフレームワーク

| テストフレームワーク | ファイル拡張子 |
| :------------------: | :------------: |
|        junit         |      xml       |
|        pytest        |      xml       |
|  nodejs-playwright   |      xml       |
|  pytest-playwright   |      xml       |
|       magicpod       |      json      |
|  mabl-deploy-event   |      json      |

※ mabl-deploy-event：[デプロイ結果のサマリー取得](https://api.help.mabl.com/reference/getexecutionresultforevent)のデータ（詳細は mabl ヘルプページ - [デプロイイベント](https://help.mabl.com/hc/ja/articles/17780788992148-%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)を参照のこと）<br>
※ 上記以外のテストフレームワークでも、junit-xml 形式のファイルで出力できるものは**junit**を設定してください

### `auto_test_suite_external_key`

連携する自動テストスイート名を設定してください。

設定しない場合の自動テストスイート名

|   テストフレームワーク   | 自動テストスイート名                                                                                       |
| :----------------------: | :--------------------------------------------------------------------------------------------------------- |
| junit,nodejs-playwright  | testsuite 要素の name 属性                                                                                 |
| pytest,pytest-playwright | testcase 要素の classname 属性<br>最後のドット以降を取得<br>（例）test.testSuite の場合、”testSuite”を取得 |
|         magicpod         | テスト一括実行設定名                                                                                       |
|    mabl-deploy-event     | テストプラン id                                                                                            |

### `auto_test_cycle_name`

連携する自動テストサイクル名を設定してください。

設定しない場合の自動テストサイクル名

|            テストフレームワーク            | 自動テストサイクル名            | 例                               |
| :----------------------------------------: | :------------------------------ | :------------------------------- |
|          junit,mabl-deploy-event           | アクション実行日時              | 9/26/2024, 4:10:10 AM            |
| pytest,nodejs-playwright,pytest-playwright | testsuite 要素の timestamp 属性 | 2024-08-28T15:12:57.311996+09:00 |
|                  magicpod                  | テスト一括実行終了日時          | 2024-05-09T02:44:32Z             |

### `auto_execution_device_external_key`

連携する自動テスト実施環境名を設定してください。

設定しない場合の自動テスト実施環境名

| テストフレームワーク  | 自動テスト実施環境名                                                                                 |
| :-------------------: | :--------------------------------------------------------------------------------------------------- |
| junit,pytest,magicpod | 標準環境                                                                                             |
|   nodejs-playwright   | testsuite 要素の hostname 属性                                                                       |
|   pytest-playwright   | testcase 要素の name 属性から取得<br>（例）test_sample[chromium-data-driven]の場合、”chromium”を取得 |
|   mabl-deploy-event   | 各 journey_executions の browser_type 属性<br>browser_type 属性がない場合は標準環境                  |

## 活用例

### OSS のテストフレームワーク

事前にテストを実行し、xml or json ファイルを出力した後で本アクションを使用します。

#### 特定ファイルを指定する場合

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

    # 事前に自動テストを実行する（必要に応じて、自動テスト結果をxml/jsonで出力する設定を行う）
  - name: Run tests
    run: pytest tests/ --junitxml=result.xml

    # 出力したファイルをもとに本アクションを使用する
  - name: link Automated Test Results
    uses: QualityForward/test-stability-report-sync@v1.2.0
    with:
      file-path: result.xml
      test-framework: pytest-playwright
      api-key: ${{ secrets.API_KEY }}
      auto_test_suite_external_key: testSuites
      auto_test_cycle_name: testCycleName
      auto_execution_device_external_key: sampleDevice
```

#### 特定のフォルダに格納されているファイルをすべて連携する場合

※**同じ**テストフレームワークに限ります

```yaml
steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Run tests
    run: pytest tests/ --junitxml=result.xml

  - name: link Automated Test Results
    uses: QualityForward/test-stability-report-sync@v1.2.0
    with:
      file-path: results/*.xml # ワイルドカードで指定
      test-framework: junit
      api-key: ${{ secrets.API_KEY }}
      auto_execution_device_external_key: chrome
```

### 有償テストツール

[OSS のテストフレームワーク](#oss-のテストフレームワーク)と同じく、事前にテストを実行した後に本アクションを使用します。

※実行方法は各有償ツールのヘルプページを参照のこと

#### MagicPod

[magicpod-api-client](https://support.magic-pod.com/hc/ja/articles/4408903744409-%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3%E4%B8%80%E6%8B%AC%E3%83%86%E3%82%B9%E3%83%88%E5%AE%9F%E8%A1%8C-%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E7%92%B0%E5%A2%83#sec3_2) を使用して、一括実行する

```yaml
jobs:
  RunMagicPod:
    runs-on: ubuntu-latest
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - uses: actions/checkout@v4

      - name: Install Packages
        run: |
          sudo apt-get update
          sudo apt-get install -y unzip

      # MagicPodの一括実行
      - name: Batch Run Test
        env:
          MAGICPOD_API_TOKEN: ${{ secrets.MAGICPOD_API_TOKEN }}
        run: |
          OS=linux
          FILENAME=magicpod-api-client

          # magicpod-api-clientのインストール
          curl -L "https://app.magicpod.com/api/v1.0/magicpod-clients/api/${OS}/latest/" -H "Authorization: Token ${MAGICPOD_API_TOKEN}" --output ${FILENAME}.zip

          # magicpod-api-clientの解凍
          unzip -q "${FILENAME}.zip" &
          UNZIP_PID=$!
          wait $UNZIP_PID

          # MagicPodで使う各種環境変数を設定
          MAGICPOD_ORGANIZATION=Organization_Name
          MAGICPOD_PROJECT=Project_Name

          # テスト一括実行
          ./magicpod-api-client.exe batch-run -t ${MAGICPOD_API_TOKEN} -o ${MAGICPOD_ORGANIZATION} -p ${MAGICPOD_PROJECT} -S Test_Settings_Number

          # 一括実行したテストNoを取得
          BATCH_RUN_NUMBER=$(./magicpod-api-client latest-batch-run-no -t ${MAGICPOD_API_TOKEN} -o ${MAGICPOD_ORGANIZATION} -p ${MAGICPOD_PROJECT})

          # 一括実行結果をjsonに出力
          ./magicpod-api-client get-batch-run -t ${MAGICPOD_API_TOKEN} -o ${MAGICPOD_ORGANIZATION} -p ${MAGICPOD_PROJECT} -b ${BATCH_RUN_NUMBER} > results/batch_run_results.json

      # アクションを使って、自動テスト結果を連携する
      - name: link automated test results
        uses: QualityForward/test-stability-report-sync@v1.2.0
        with:
          file-path: results/batch_run_results.json
          test-framework: magicpod
          api-key: ${{ secrets.API_KEY }}
          auto_execution_device_external_key: Chrome
```

#### mabl デプロイイベント

[mabl cli](https://help.mabl.com/hc/ja/articles/17752848113556-mabl-CLI%E3%81%AE%E6%A6%82%E8%A6%81) を使用して、デプロイイベントを実行後、結果を連携する

```yaml
jobs:
  RunMablDeployEvent:
    runs-on: ubuntu-latest
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      MABL_API_TOKEN: ${{ secrets.MABL_API_TOKEN }}
    steps:
      - uses: actions/checkout@v4

      - name: Install node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      # mabl cliのインストール
      - name: Install and setup mabl-cli
        run: |
          npm install -g @mablhq/mabl-cli@latest
          mabl auth activate-key ${MABL_API_TOKEN}

      # mablのデプロイイベントの実行
      - name: Batch Run Test
        env:
          APPLICATION_ID: applicationのID
          ENVIRONMENT_ID: environmentのid
          LABEL: ラベル名
        run: |
          set -euxo pipefail

          # MEMO: テストが失敗した時、処理が止まるため一時的に無効にする
          set +e
          mabl deployments create --application-id ${APPLICATION_ID} --environment-id ${ENVIRONMENT_ID} --labels ${LABEL} --await-completion -o json > results/mabl_result.json
          set -e

      # アクションを使って、自動テスト結果を連携する
      - name: link automated test results
        uses: QualityForward/test-stability-report-sync@v1.2.0
        with:
          file-path: results/mabl_result.json
          test-framework: mabl-deploy-event
          api-key: ${{ secrets.API_KEY }}
```
