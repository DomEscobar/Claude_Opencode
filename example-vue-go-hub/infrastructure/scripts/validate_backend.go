package main

import (
	"fmt"
	"os"
	"strings"
)

/*
SCRIPTS/FORCE_GO_PROTOCOL.GO
This is the internal 'Immune System' for /example-vue-go-hub/backend/.
It ensures no implementations are written without a Contract and a Red-Test.
*/

func main() {
	fmt.Println("🛡️  [OODA] Validating Backend Partition...")
	
	// Check for localized orientation
	if _, err := os.Stat("AGENTS.md"); os.IsNotExist(err) {
		fmt.Println("❌ CRITICAL: AGENTS.md missing in current partition.")
		os.Exit(1)
	}

	// Check for Contract Node
	if _, err := os.Stat("schemas.go"); os.IsNotExist(err) {
		fmt.Println("❌ CRITICAL: Contract Node (schemas.go) missing.")
		os.Exit(1)
	}

	fmt.Println("✅ Partition Aligned. Proceed to RED STATE.")
}
