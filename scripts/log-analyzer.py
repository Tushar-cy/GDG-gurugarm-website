#!/usr/bin/env python3
"""
GDG Project Log Analyzer
Analyzes log files and provides insights and statistics
"""

import os
import re
import json
import argparse
import datetime
from collections import defaultdict, Counter
from pathlib import Path
import sys

class LogAnalyzer:
    def __init__(self, log_dir="./logs"):
        self.log_dir = Path(log_dir)
        self.stats = {
            'total_entries': 0,
            'error_count': 0,
            'warning_count': 0,
            'info_count': 0,
            'debug_count': 0,
            'activity_count': 0,
            'performance_count': 0,
            'api_calls': 0,
            'user_actions': 0,
            'time_range': {'start': None, 'end': None}
        }
        self.patterns = {
            'timestamp': r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})',
            'level': r'\[(ERROR|WARN|INFO|DEBUG)\]',
            'component': r'\[([A-Z_]+)\]',
            'activity': r'\[([A-Z_]+)\] \[([A-Z_]+)\]',
            'performance': r'(\d+)ms',
            'api_call': r'(GET|POST|PUT|DELETE) /api/',
            'error': r'Exception:|Error:|ERROR'
        }

    def analyze_file(self, file_path):
        """Analyze a single log file"""
        print(f"Analyzing {file_path.name}...")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    self.analyze_line(line.strip(), line_num)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")

    def analyze_line(self, line, line_num):
        """Analyze a single log line"""
        if not line:
            return
            
        self.stats['total_entries'] += 1
        
        # Extract timestamp
        timestamp_match = re.search(self.patterns['timestamp'], line)
        if timestamp_match:
            timestamp_str = timestamp_match.group(1)
            try:
                timestamp = datetime.datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
                if not self.stats['time_range']['start'] or timestamp < self.stats['time_range']['start']:
                    self.stats['time_range']['start'] = timestamp
                if not self.stats['time_range']['end'] or timestamp > self.stats['time_range']['end']:
                    self.stats['time_range']['end'] = timestamp
            except ValueError:
                pass
        
        # Count log levels
        if re.search(self.patterns['level'], line):
            level_match = re.search(self.patterns['level'], line)
            if level_match:
                level = level_match.group(1)
                self.stats[f'{level.lower()}_count'] += 1
        
        # Count activity types
        if '[ACTIVITY]' in line:
            self.stats['activity_count'] += 1
            activity_match = re.search(self.patterns['activity'], line)
            if activity_match:
                component = activity_match.group(1)
                action = activity_match.group(2)
                # Track specific activity types
                if component == 'API':
                    self.stats['api_calls'] += 1
                elif component in ['USER', 'AUTH']:
                    self.stats['user_actions'] += 1
        
        # Count performance entries
        if 'PERFORMANCE' in line:
            self.stats['performance_count'] += 1
        
        # Count errors
        if re.search(self.patterns['error'], line, re.IGNORECASE):
            self.stats['error_count'] += 1

    def generate_report(self):
        """Generate analysis report"""
        report = {
            'summary': self.stats.copy(),
            'recommendations': [],
            'insights': []
        }
        
        # Convert datetime objects to strings for JSON serialization
        if self.stats['time_range']['start']:
            report['summary']['time_range']['start'] = self.stats['time_range']['start'].isoformat()
        if self.stats['time_range']['end']:
            report['summary']['time_range']['end'] = self.stats['time_range']['end'].isoformat()
        
        # Generate insights
        total_entries = self.stats['total_entries']
        if total_entries > 0:
            error_rate = (self.stats['error_count'] / total_entries) * 100
            activity_rate = (self.stats['activity_count'] / total_entries) * 100
            
            report['insights'].append(f"Error rate: {error_rate:.2f}%")
            report['insights'].append(f"Activity logging rate: {activity_rate:.2f}%")
            
            if error_rate > 5:
                report['recommendations'].append("High error rate detected. Consider investigating error patterns.")
            
            if self.stats['performance_count'] > 0:
                report['insights'].append(f"Performance monitoring active: {self.stats['performance_count']} entries")
            
            if self.stats['api_calls'] > 0:
                report['insights'].append(f"API activity: {self.stats['api_calls']} calls logged")
        
        return report

    def print_summary(self):
        """Print summary to console"""
        print("\n" + "="*50)
        print("LOG ANALYSIS SUMMARY")
        print("="*50)
        
        print(f"Total log entries: {self.stats['total_entries']}")
        print(f"Error entries: {self.stats['error_count']}")
        print(f"Warning entries: {self.stats['warning_count']}")
        print(f"Info entries: {self.stats['info_count']}")
        print(f"Debug entries: {self.stats['debug_count']}")
        print(f"Activity entries: {self.stats['activity_count']}")
        print(f"Performance entries: {self.stats['performance_count']}")
        print(f"API calls: {self.stats['api_calls']}")
        print(f"User actions: {self.stats['user_actions']}")
        
        if self.stats['time_range']['start'] and self.stats['time_range']['end']:
            duration = self.stats['time_range']['end'] - self.stats['time_range']['start']
            print(f"Time range: {self.stats['time_range']['start']} to {self.stats['time_range']['end']}")
            print(f"Duration: {duration}")
        
        print("="*50)

def main():
    parser = argparse.ArgumentParser(description='Analyze GDG project logs')
    parser.add_argument('--log-dir', default='./logs', help='Log directory path')
    parser.add_argument('--output', help='Output file for JSON report')
    parser.add_argument('--format', choices=['json', 'summary'], default='summary', help='Output format')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.log_dir):
        print(f"Error: Log directory '{args.log_dir}' does not exist")
        sys.exit(1)
    
    analyzer = LogAnalyzer(args.log_dir)
    
    # Analyze all log files
    log_files = list(Path(args.log_dir).glob('*.log'))
    if not log_files:
        print(f"No log files found in {args.log_dir}")
        sys.exit(1)
    
    for log_file in log_files:
        analyzer.analyze_file(log_file)
    
    # Generate report
    report = analyzer.generate_report()
    
    if args.format == 'summary':
        analyzer.print_summary()
    elif args.format == 'json':
        print(json.dumps(report, indent=2))
    
    # Save to file if requested
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(report, f, indent=2)
        print(f"Report saved to {args.output}")

if __name__ == '__main__':
    main()