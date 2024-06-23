package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sync"
)

func main() {
	log.SetFlags(0)

	if len(os.Args) < 2 {
		log.Fatal("使用方法: ripfonts <name> < 入力ファイル")
	}

	destDir := os.Args[1]
	cssFileName := destDir + ".css"

	// 標準入力からスタイルシートを読み込む
	styleSheet, err := io.ReadAll(os.Stdin)
	if err != nil {
		log.Fatal("入力の読み込みエラー: ", err)
	}
	log.Print("入力の読み込みに成功しました")

	// @font-faceルール内の.woff2フォントURLを抽出する正規表現パターン
	re := regexp.MustCompile(`@font-face\s*{[^}]*url\(([^)]*.woff2)\)[^}]*}`)
	matches := re.FindAllSubmatch(styleSheet, -1)
	log.Print("検出されたフォント数: ", len(matches))

	// フォントファイルを保存するためのディレクトリを作成
	if err := os.MkdirAll(destDir, 0755); err != nil {
		log.Fatal("保存先ディレクトリの作成に失敗しました: ", err)
	}

	var wg sync.WaitGroup
	var mu sync.Mutex
	for _, match := range matches {
		url := match[1]
		fileName := filepath.Base(string(url))

		wg.Add(1)
		go func(url []byte, fileName string) {
			defer wg.Done()
			log.Print("ダウンロード中: ", fileName)

			// フォントファイルをダウンロード
			resp, err := http.Get(string(url))
			if err != nil {
				log.Fatal("フォントのダウンロードに失敗しました: ", err)
			}
			defer resp.Body.Close()

			// フォントファイルを保存
			fontFile, err := os.Create(filepath.Join(destDir, fileName))
			if err != nil {
				log.Fatal(err)
			}
			defer fontFile.Close()

			_, err = io.Copy(fontFile, resp.Body)
			if err != nil {
				log.Fatal(err)
			}

			log.Print("ダウンロード完了: ", fileName)

			// CSSのURLをローカルファイルパスに置き換える
			mu.Lock()
			styleSheet = bytes.Replace(styleSheet, url, []byte(filepath.Join(filepath.Base(destDir), fileName)), 1)
			mu.Unlock()
		}(url, fileName)
	}

	wg.Wait()

	// 変更後のスタイルシートをファイルに保存
	if err := os.WriteFile(cssFileName, styleSheet, 0644); err != nil {
		log.Fatal("CSSファイルの書き込みエラー: ", err)
	}

	log.Print("CSSファイルを書き込みました: ", cssFileName)
}
