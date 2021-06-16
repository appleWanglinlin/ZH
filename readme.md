- [x] vscode中打开typora

  - 在tasks.json中配置任务

    ```json
    {
        "label": "Open Typora",
        "type": "process",
        "windows": {
            "command": "C:\\Program Files\\Typora\\Typora.exe",
            "args": [
                "${file}"
            ]
        },
        "group": {
            "kind": "test",
            "isDefault": true
        },
        "presentation": {
            "reveal": "always",
            "panel": "new"
        },
        "problemMatcher": []
    }
    ```

  - 选中进入md文件，ctrl + shift + p，选择运行Open Typora任务