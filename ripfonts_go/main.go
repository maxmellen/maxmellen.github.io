package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
)

func main() {
	log.SetFlags(0)

	if len(os.Args) < 2 {
		log.Fatal("使用方法: ripfonts <name> < 入力ファイル")
	}

	destDir := os.Args[1]
	cssFileName := destDir + ".css"

	inputData, err := io.ReadAll(os.Stdin)
	if err != nil {
		log.Panic(err)
	}

	styleSheet := string(inputData)
	fontFaceRegex := regexp.MustCompile(`@font-face\s*{[^}]*font-family:\s*["']([^"']+)["'][^}]*src:\s*url\(["']?([^)]+?)["']?\)`)
	matches := fontFaceRegex.FindAllStringSubmatch(styleSheet, -1)

	err = os.MkdirAll(destDir, 0755)
	if err != nil {
		log.Panic(err)
	}

	var wg sync.WaitGroup
	var mu sync.Mutex
	for _, match := range matches {
		fontFamily := match[1]
		fontUrl := match[2]
		fileName := filepath.Base(fontUrl)
		destPath := filepath.Join(destDir, fileName)

		wg.Add(1)
		go func(fontFamily, fontUrl, fileName, destPath string) {
			defer wg.Done()

			log.Print("ダウンロード中: ", fileName)
			resp, err := http.Get(fontUrl)
			if err != nil {
				log.Panic(err)
			}
			defer resp.Body.Close()

			out, err := os.Create(destPath)
			if err != nil {
				log.Panic(err)
			}
			defer out.Close()

			_, err = io.Copy(out, resp.Body)
			if err != nil {
				log.Panic(err)
			}
			log.Print("ダウンロード完了: ", fileName)

			mu.Lock()
			styleSheet = strings.Replace(
				styleSheet,
				fmt.Sprintf("url(%s)", fontUrl),
				fmt.Sprintf("local('%s'), url('%s')",
					fontFamily,
					filepath.Join(filepath.Base(destDir), fileName),
				),
				1,
			)
			mu.Unlock()
		}(fontFamily, fontUrl, fileName, destPath)
	}

	wg.Wait()

	err = os.WriteFile(cssFileName, []byte(styleSheet), 0644)
	if err != nil {
		log.Panic(err)
	}

	log.Print("CSSファイルを書き込みました: ", cssFileName)
}
