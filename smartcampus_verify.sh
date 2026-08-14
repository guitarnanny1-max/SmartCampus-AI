#!/bin/bash
set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

LOG_DIR="./logs"
VERIFY_LOG="${LOG_DIR}/system_verification.log"
mkdir -p "$LOG_DIR"

log() { echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] [$1] $2" | tee -a "${VERIFY_LOG}"; }

log "${BLUE}INFO${NC}" "Initiating full system verification sweep..."

components=("smartcampus_360_os.sh" "smartcampus_backup.sh" "Makefile" "docker-compose.yml")
failed=0

for comp in "${components[@]}"; do
    if [[ -f "$comp" ]]; then
        log "${GREEN}SUCCESS${NC}" "Found essential component: $comp"
    else
        log "${RED}ERROR${NC}" "Missing essential component: $comp"
        ((failed++))
    fi
done

if [[ $failed -eq 0 ]]; then
    log "${GREEN}SUCCESS${NC}" "================================================================"
    log "${GREEN}SUCCESS${NC}" " ALL SYSTEM VERIFICATION CHECKS PASSED SUCCESSFULLY"
    log "${GREEN}SUCCESS${NC}" "================================================================"
else
    log "${RED}ERROR${NC}" "System verification failed. Missing components detected."
    exit 1
fi
