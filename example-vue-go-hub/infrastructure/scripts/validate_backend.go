package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Println("Validating backend structure...")

	required := []string{
		"AGENTS.md",
		"go.mod",
		"cmd/main.go",
		"internal/types/response.go",
		"internal/types/schemas.go",
	}

	failed := false
	for _, path := range required {
		if _, err := os.Stat(path); os.IsNotExist(err) {
			fmt.Printf("MISSING: %s\n", path)
			failed = true
		}
	}

	if failed {
		fmt.Println("Validation failed. See missing files above.")
		os.Exit(1)
	}

	fmt.Println("Backend structure is valid.")
}
