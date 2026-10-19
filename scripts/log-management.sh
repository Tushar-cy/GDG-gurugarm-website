#!/bin/bash

# GDG Project Log Management Script
# Provides utilities for managing and analyzing logs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOG_DIR="./logs"
BACKUP_DIR="./log-backups"
MAX_LOG_SIZE="100M"
RETENTION_DAYS=30

# Create directories if they don't exist
mkdir -p "$LOG_DIR"
mkdir -p "$BACKUP_DIR"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to show help
show_help() {
    echo "GDG Project Log Management Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  status          Show log status and statistics"
    echo "  rotate          Rotate log files"
    echo "  clean           Clean old log files"
    echo "  backup          Backup current logs"
    echo "  analyze         Analyze log patterns"
    echo "  tail [file]     Tail a specific log file"
    echo "  search [term]   Search for terms in logs"
    echo "  errors          Show recent errors"
    echo "  performance     Show performance metrics"
    echo "  activity        Show recent activity"
    echo "  export          Export logs for analysis"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 tail activity.log"
    echo "  $0 search 'ERROR'"
    echo "  $0 analyze"
}

# Function to show log status
show_status() {
    print_header "Log Status"
    
    if [ ! -d "$LOG_DIR" ]; then
        print_error "Log directory does not exist: $LOG_DIR"
        return 1
    fi
    
    echo "Log Directory: $LOG_DIR"
    echo "Backup Directory: $BACKUP_DIR"
    echo ""
    
    # Show log files and sizes
    echo "Log Files:"
    ls -lh "$LOG_DIR"/*.log 2>/dev/null | while read -r line; do
        echo "  $line"
    done
    
    echo ""
    
    # Show total log size
    total_size=$(du -sh "$LOG_DIR" 2>/dev/null | cut -f1)
    echo "Total Log Size: $total_size"
    
    # Show log counts
    echo ""
    echo "Log Entries:"
    for log_file in "$LOG_DIR"/*.log; do
        if [ -f "$log_file" ]; then
            filename=$(basename "$log_file")
            count=$(wc -l < "$log_file" 2>/dev/null || echo "0")
            echo "  $filename: $count lines"
        fi
    done
}

# Function to rotate logs
rotate_logs() {
    print_header "Rotating Logs"
    
    timestamp=$(date +"%Y%m%d_%H%M%S")
    
    for log_file in "$LOG_DIR"/*.log; do
        if [ -f "$log_file" ]; then
            filename=$(basename "$log_file")
            backup_file="$BACKUP_DIR/${filename}.${timestamp}"
            
            print_status "Rotating $filename"
            cp "$log_file" "$backup_file"
            > "$log_file"  # Clear the log file
            
            print_status "Backed up to $backup_file"
        fi
    done
    
    print_status "Log rotation completed"
}

# Function to clean old logs
clean_logs() {
    print_header "Cleaning Old Logs"
    
    # Remove old backup files
    find "$BACKUP_DIR" -name "*.log.*" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Compress old log files
    find "$LOG_DIR" -name "*.log.*" -mtime +7 -exec gzip {} \; 2>/dev/null || true
    
    print_status "Cleaned logs older than $RETENTION_DAYS days"
}

# Function to backup logs
backup_logs() {
    print_header "Backing Up Logs"
    
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_file="$BACKUP_DIR/logs_backup_${timestamp}.tar.gz"
    
    tar -czf "$backup_file" -C "$LOG_DIR" . 2>/dev/null || {
        print_error "Failed to create backup"
        return 1
    }
    
    print_status "Logs backed up to $backup_file"
}

# Function to analyze logs
analyze_logs() {
    print_header "Log Analysis"
    
    # Analyze error patterns
    echo "Error Analysis:"
    grep -h "ERROR" "$LOG_DIR"/*.log 2>/dev/null | \
        awk '{print $1, $2}' | \
        sort | uniq -c | sort -nr | head -10 || echo "  No errors found"
    
    echo ""
    
    # Analyze activity patterns
    echo "Activity Analysis:"
    grep -h "\[.*\]" "$LOG_DIR"/activity.log 2>/dev/null | \
        awk '{print $2}' | \
        sort | uniq -c | sort -nr | head -10 || echo "  No activity data found"
    
    echo ""
    
    # Analyze performance
    echo "Performance Analysis:"
    grep -h "PERFORMANCE" "$LOG_DIR"/*.log 2>/dev/null | \
        awk '{print $(NF-1)}' | \
        sort -n | tail -10 || echo "  No performance data found"
}

# Function to tail logs
tail_logs() {
    local log_file="$1"
    
    if [ -z "$log_file" ]; then
        print_error "Please specify a log file"
        echo "Available log files:"
        ls "$LOG_DIR"/*.log 2>/dev/null | while read -r file; do
            echo "  $(basename "$file")"
        done
        return 1
    fi
    
    local full_path="$LOG_DIR/$log_file"
    
    if [ ! -f "$full_path" ]; then
        print_error "Log file not found: $full_path"
        return 1
    fi
    
    print_header "Tailing $log_file"
    tail -f "$full_path"
}

# Function to search logs
search_logs() {
    local search_term="$1"
    
    if [ -z "$search_term" ]; then
        print_error "Please provide a search term"
        return 1
    fi
    
    print_header "Searching for: $search_term"
    
    grep -r -n -i "$search_term" "$LOG_DIR"/*.log 2>/dev/null | head -20 || {
        print_warning "No matches found for: $search_term"
    }
}

# Function to show recent errors
show_errors() {
    print_header "Recent Errors"
    
    grep -h "ERROR" "$LOG_DIR"/*.log 2>/dev/null | tail -20 || {
        print_warning "No errors found"
    }
}

# Function to show performance metrics
show_performance() {
    print_header "Performance Metrics"
    
    grep -h "PERFORMANCE" "$LOG_DIR"/*.log 2>/dev/null | tail -20 || {
        print_warning "No performance data found"
    }
}

# Function to show recent activity
show_activity() {
    print_header "Recent Activity"
    
    tail -20 "$LOG_DIR"/activity.log 2>/dev/null || {
        print_warning "No activity log found"
    }
}

# Function to export logs
export_logs() {
    print_header "Exporting Logs"
    
    timestamp=$(date +"%Y%m%d_%H%M%S")
    export_file="gdg_logs_export_${timestamp}.tar.gz"
    
    tar -czf "$export_file" -C "$LOG_DIR" . 2>/dev/null || {
        print_error "Failed to export logs"
        return 1
    }
    
    print_status "Logs exported to $export_file"
}

# Main script logic
case "${1:-help}" in
    "status")
        show_status
        ;;
    "rotate")
        rotate_logs
        ;;
    "clean")
        clean_logs
        ;;
    "backup")
        backup_logs
        ;;
    "analyze")
        analyze_logs
        ;;
    "tail")
        tail_logs "$2"
        ;;
    "search")
        search_logs "$2"
        ;;
    "errors")
        show_errors
        ;;
    "performance")
        show_performance
        ;;
    "activity")
        show_activity
        ;;
    "export")
        export_logs
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac