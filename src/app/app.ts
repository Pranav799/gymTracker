import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

export interface ParsedPermission {
  id: string;
  permissionName: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  copied: boolean;
  editing: boolean;
  status: 'active' | 'completed';
  copiedField?: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: number;
  serviceCode: string;
  servicePrefix: string;
  permissions: ParsedPermission[];
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class App {
  title = 'permission-mapper';

  // State signals
  serviceCode = signal('');
  servicePrefix = signal('');
  permissions = signal<ParsedPermission[]>([]);
  step = signal<'landing' | 'input' | 'review'>('landing');
  searchQuery = signal('');
  filterMethod = signal<string>('ALL');
  filterStatus = signal<'active' | 'completed'>('active');
  globalCopied = signal(false);
  deleteOnCopy = signal(false);
  parseError = signal('');
  prefixTouched = signal(false);

  // History signals
  history = signal<HistoryItem[]>([]);
  historyOpen = signal(false);
  currentSessionId = signal<string | null>(null);
  editingHistoryId = signal<string | null>(null);
  tempHistoryName = signal<string>('');
  tempHistoryDesc = signal<string>('');
  tempHistoryTags = signal<string>('');
  historySearchQuery = signal<string>('');

  constructor() {
    this.loadHistoryFromStorage();
  }

  private loadHistoryFromStorage(): void {
    const stored = localStorage.getItem('perm_mapper_history');
    if (stored) {
      try {
        this.history.set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }

  private persistHistory(): void {
    localStorage.setItem('perm_mapper_history', JSON.stringify(this.history()));
  }

  saveToHistory(): void {
    const code = this.serviceCode();
    const prefix = this.servicePrefix();
    const perms = this.permissions();

    if (!code || !prefix) return;

    const existingId = this.currentSessionId();
    const history = [...this.history()];
    
    if (existingId) {
      const index = history.findIndex(h => h.id === existingId);
      if (index !== -1) {
        history[index] = {
          ...history[index],
          timestamp: Date.now(),
          serviceCode: code,
          servicePrefix: prefix,
          permissions: perms,
          description: this.generateHistorySummary(perms)
        };
      } else {
        // Fallback if ID was lost
        this.createNewHistoryItem(history, code, prefix, perms);
      }
    } else {
      this.createNewHistoryItem(history, code, prefix, perms);
    }

    this.history.set(history);
    this.persistHistory();
  }

  private createNewHistoryItem(history: HistoryItem[], code: string, prefix: string, perms: ParsedPermission[]): void {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      name: `${prefix} - ${new Date().toLocaleDateString()}`,
      timestamp: Date.now(),
      serviceCode: code,
      servicePrefix: prefix,
      permissions: perms,
      description: this.generateHistorySummary(perms),
      tags: []
    };
    history.unshift(newItem); // Newest first
    this.currentSessionId.set(newItem.id);
  }

  private generateHistorySummary(perms: ParsedPermission[]): string {
    const counts: Record<string, number> = {};
    perms.forEach(p => {
      const action = this.getPermissionAction(p.method);
      counts[action] = (counts[action] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([action, count]) => `${count} ${action}`)
      .join(', ') || 'No permissions mapped';
  }

  getHistoryMethods(perms: ParsedPermission[]): {method: string, count: number}[] {
    const counts: Record<string, number> = {};
    perms.forEach(p => {
      counts[p.method] = (counts[p.method] || 0) + 1;
    });
    return Object.entries(counts).map(([method, count]) => ({ method, count }));
  }

  filteredHistory = computed(() => {
    const query = this.historySearchQuery().toLowerCase().trim();
    if (!query) return this.history();
    return this.history().filter(h => 
      h.name.toLowerCase().includes(query) || 
      h.description.toLowerCase().includes(query) ||
      h.tags.some(t => t.toLowerCase().includes(query))
    );
  });

  resetMapping(): void {
    this.serviceCode.set('');
    this.servicePrefix.set('');
    this.permissions.set([]);
    this.currentSessionId.set(null);
    this.historyOpen.set(false);
    this.step.set('input');
    this.parseError.set('');
    this.prefixTouched.set(false);
  }



  loadFromHistory(item: HistoryItem): void {
    this.serviceCode.set(item.serviceCode);
    this.servicePrefix.set(item.servicePrefix);
    this.permissions.set([...item.permissions]);
    this.currentSessionId.set(item.id);
    this.step.set('review');
    this.historyOpen.set(false);
  }

  deleteFromHistory(id: string, event: Event): void {
    event.stopPropagation();
    const updated = this.history().filter(h => h.id !== id);
    this.history.set(updated);
    this.persistHistory();
    if (this.currentSessionId() === id) {
      this.currentSessionId.set(null);
    }
  }

  renameHistoryItem(id: string, event: Event): void {
    event.stopPropagation();
    const item = this.history().find(h => h.id === id);
    if (!item) return;

    this.editingHistoryId.set(id);
    this.tempHistoryName.set(item.name);
    this.tempHistoryDesc.set(item.description);
    this.tempHistoryTags.set((item.tags || []).join(', '));
  }

  confirmHistoryRename(id: string, event: Event): void {
    event.stopPropagation();
    const newName = this.tempHistoryName().trim();
    const newDesc = this.tempHistoryDesc().trim();
    const newTags = this.tempHistoryTags().split(',').map(t => t.trim()).filter(t => !!t);
    
    if (newName) {
      const updated = this.history().map(h => 
        h.id === id ? { ...h, name: newName, description: newDesc, tags: newTags } : h
      );
      this.history.set(updated);
      this.persistHistory();
    }
    this.editingHistoryId.set(null);
  }

  cancelHistoryRename(event: Event): void {
    event.stopPropagation();
    this.editingHistoryId.set(null);
  }

  detectedMethods = computed(() => {
    const code = this.serviceCode();
    const methods = new Set<string>();
    const patterns = [
      { regex: /\.getData\(/, method: 'GET' },
      { regex: /\.postData\(/, method: 'POST' },
      { regex: /\.putData\(/, method: 'PUT' },
      { regex: /\.deleteData\(/, method: 'DELETE' },
      { regex: /\.patchData\(/, method: 'PATCH' },
      { regex: /\.get\(/, method: 'GET' },
      { regex: /\.post\(/, method: 'POST' },
      { regex: /\.put\(/, method: 'PUT' },
      { regex: /\.delete\(/, method: 'DELETE' },
      { regex: /\.patch\(/, method: 'PATCH' },
    ];
    
    patterns.forEach(({ regex, method }) => {
      if (regex.test(code)) {
        methods.add(method);
      }
    });
    
    return Array.from(methods);
  });


  // Derived
  filteredPermissions = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const m = this.filterMethod();
    const s = this.filterStatus();
    return this.permissions().filter(p => {
      if (p.status !== s) return false;
      const matchSearch = !q ||
        p.permissionName.toLowerCase().includes(q) ||
        p.endpoint.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      
      let matchMethod = m === 'ALL';
      if (!matchMethod) {
        if (s === 'active') {
          matchMethod = p.method === m;
        } else {
          matchMethod = this.getPermissionAction(p.method) === m;
        }
      }
      
      return matchSearch && matchMethod;
    });
  });

  methodCounts = computed(() => {
    const counts: Record<string, number> = { ALL: 0 };
    const s = this.filterStatus();
    this.permissions().forEach(p => {
      if (p.status === s) {
        counts['ALL']++;
        const key = s === 'active' ? p.method : this.getPermissionAction(p.method);
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  });

  statusCounts = computed(() => {
    return {
      active: this.permissions().filter(p => p.status === 'active').length,
      completed: this.permissions().filter(p => p.status === 'completed').length,
    };
  });

  groupedCompletedPermissions = computed(() => {
    const filter = this.filterMethod();
    const groups: Record<string, ParsedPermission[]> = {};
    
    this.permissions().filter(p => p.status === 'completed').forEach(p => {
      const action = this.getPermissionAction(p.method);
      if (filter !== 'ALL' && action !== filter) return;
      
      if (!groups[action]) groups[action] = [];
      groups[action].push(p);
    });
    return Object.entries(groups).map(([action, items]) => ({ action, items }));
  });

  readonly methods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  readonly actionMethods = ['ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE'];

  parseServiceCode(): void {
    this.prefixTouched.set(true);
    const code = this.serviceCode();
    if (!code.trim()) {
      this.parseError.set('Please paste some Angular service code first.');
      return;
    }
    this.parseError.set('');
    
    if (!this.servicePrefix().trim()) {
      this.parseError.set('Please enter a Service Prefix (e.g. HMS, CORE) first.');
      return;
    }

    const parsed = this.extractPermissions(code);
    if (parsed.length === 0) {
      this.parseError.set('No API endpoints found. Make sure the code contains httpService.getData/postData/putData/deleteData calls.');
      return;
    }

    this.permissions.set(parsed);
    this.filterStatus.set('active');
    this.filterMethod.set('ALL');
    this.searchQuery.set('');
    this.step.set('review');
    this.saveToHistory();
  }



  private extractPermissions(code: string): ParsedPermission[] {
    const results: ParsedPermission[] = [];

    // Match method blocks: methodName(...): ... { ... httpService.xxxData(url) ... }
    const methodBlockRegex = /(\w+)\s*\([^)]*\)\s*:\s*Observable[^{]*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;

    let match: RegExpExecArray | null;
    while ((match = methodBlockRegex.exec(code)) !== null) {
      const methodName = match[1];
      const body = match[2];

      // Skip constructor
      if (methodName === 'constructor') continue;

      // Detect HTTP method and URL
      const httpCall = this.extractHttpCall(body);
      if (!httpCall) continue;

      const resourceName = this.camelToPermissionName(methodName);
      const action = this.getPermissionAction(httpCall.method);
      const permName = `${this.servicePrefix().toUpperCase()}.${resourceName}.${action}`;
      
      const desc = this.generateDescription(methodName, httpCall.method, httpCall.url);

      results.push({
        id: crypto.randomUUID(),
        permissionName: permName,
        description: desc,
        endpoint: ('/kjusys-api/' + httpCall.url).replace(/\/+/g, '/'),
        method: httpCall.method,
        copied: false,
        editing: false,
        status: 'active',
      });
    }

    // Fallback: direct line-by-line extraction
    if (results.length === 0) {
      return this.fallbackExtract(code);
    }

    return results;
  }

  private extractHttpCall(body: string): { method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; url: string } | null {
    const patterns: { regex: RegExp; method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' }[] = [
      { regex: /\.getData\(\s*[`'"]([\s\S]*?)[`'"]\s*\)/, method: 'GET' },
      { regex: /\.postData\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'POST' },
      { regex: /\.putData\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'PUT' },
      { regex: /\.deleteData\(\s*[`'"]([\s\S]*?)[`'"]\s*\)/, method: 'DELETE' },
      { regex: /\.patchData\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'PATCH' },
      { regex: /\.get\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'GET' },
      { regex: /\.post\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'POST' },
      { regex: /\.put\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'PUT' },
      { regex: /\.delete\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'DELETE' },
      { regex: /\.patch\(\s*[`'"]([\s\S]*?)[`'"]\s*[,)]/, method: 'PATCH' },
    ];

    for (const { regex, method } of patterns) {
      const m = body.match(regex);
      if (m) {
        // Clean up template literal interpolations for display
        let url = m[1].replace(/\$\{[^}]+\}/g, ':param').trim();
        return { method, url };
      }
    }

    // Try extracting from a url variable
    const urlVarMatch = body.match(/(?:const|let|var)\s+url\s*=\s*[`'"]([\s\S]*?)[`'"]/);
    if (urlVarMatch) {
      const urlStr = urlVarMatch[1].replace(/\$\{[^}]+\}/g, ':param').trim();
      // Now find which HTTP method uses this url
      for (const { regex, method } of patterns) {
        const altRegex = new RegExp(regex.source.replace(/\[([\s\S]*?)\]/, '[A-Za-z]').toString());
        const found = body.match(/\.(getData|postData|putData|deleteData|patchData|get|post|put|delete|patch)\s*\(\s*url/);
        if (found) {
          const methodMap: Record<string, 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'> = {
            getData: 'GET', get: 'GET',
            postData: 'POST', post: 'POST',
            putData: 'PUT', put: 'PUT',
            deleteData: 'DELETE', delete: 'DELETE',
            patchData: 'PATCH', patch: 'PATCH',
          };
          return { method: methodMap[found[1]] || 'GET', url: urlStr };
        }
      }
      return { method: 'GET', url: urlStr };
    }

    return null;
  }

  private fallbackExtract(code: string): ParsedPermission[] {
    const results: ParsedPermission[] = [];
    const lines = code.split('\n');

    const httpPatterns: { regex: RegExp; method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' }[] = [
      { regex: /\.getData\(\s*[`'"](.*?)[`'"]/, method: 'GET' },
      { regex: /\.postData\(\s*[`'"](.*?)[`'"]/, method: 'POST' },
      { regex: /\.putData\(\s*[`'"](.*?)[`'"]/, method: 'PUT' },
      { regex: /\.deleteData\(\s*[`'"](.*?)[`'"]/, method: 'DELETE' },
      { regex: /\.patchData\(\s*[`'"](.*?)[`'"]/, method: 'PATCH' },
      { regex: /\.get\(\s*[`'"](.*?)[`'"]/, method: 'GET' },
      { regex: /\.post\(\s*[`'"](.*?)[`'"]/, method: 'POST' },
      { regex: /\.put\(\s*[`'"](.*?)[`'"]/, method: 'PUT' },
      { regex: /\.delete\(\s*[`'"](.*?)[`'"]/, method: 'DELETE' },
      { regex: /\.patch\(\s*[`'"](.*?)[`'"]/, method: 'PATCH' },
    ];

    let currentMethod = '';
    for (const line of lines) {
      // Capture method name
      const fnMatch = line.match(/^\s*(\w+)\s*\([^)]*\)\s*:\s*Observable/);
      if (fnMatch) {
        currentMethod = fnMatch[1];
      }

      for (const { regex, method } of httpPatterns) {
        const m = line.match(regex);
        if (m) {
          const url = m[1].replace(/\$\{[^}]+\}/g, ':param');
          const name = currentMethod || 'unknown';
          const action = this.getPermissionAction(method);
          const resourceName = this.camelToPermissionName(name);

          results.push({
            id: crypto.randomUUID(),
            permissionName: `${this.servicePrefix().toUpperCase()}.${resourceName}.${action}`,
            description: this.generateDescription(name, method, url),
            endpoint: ('/kjusys-api/' + url).replace(/\/+/g, '/'),
            method,
            copied: false,
            editing: false,
            status: 'active',
          });
        }
      }
    }

    return results;
  }

  private camelToPermissionName(name: string): string {
    // Strip common prefixes first
    const cleanName = name.replace(/^(get|post|put|delete|patch|update|create|remove|fetch|save)\d*/i, '');
    
    // Convert camelCase to SCREAMING-HYPHEN-CASE permission name
    return (cleanName || name)
      .replace(/([A-Z])/g, '-$1')
      .toUpperCase()
      .trim()
      .replace(/^-/, '');
  }

  private generateDescription(methodName: string, httpMethod: string, url: string): string {
    const parts = url.split('/').filter(Boolean);
    const resource = parts[parts.length - 1]?.replace(/-/g, ' ').replace(/(:[\w-]+|\{[^}]+\})/g, '').trim() || 'resource';

    const verbMap: Record<string, string> = {
      GET: 'Retrieve',
      POST: 'Create',
      PUT: 'Update',
      DELETE: 'Delete',
      PATCH: 'Patch',
    };
    const verb = verbMap[httpMethod] || 'Access';

    // Use human-readable method name
    const humanName = methodName.replace(/([A-Z])/g, ' $1').trim();
    return `${verb} ${resource} - ${humanName}`;
  }

  private getPermissionAction(method: string): string {
    const map: Record<string, string> = {
      GET: 'READ',
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };
    return map[method] || 'READ';
  }

  // === Actions ===

  copyField(id: string, field: string, value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      this.permissions.update(perms =>
        perms.map(p => p.id === id ? { ...p, copiedField: field } : p)
      );

      // Handle "Delete on Copy" for COMPLETED name field
      if (field === 'name' && this.filterStatus() === 'completed' && this.deleteOnCopy()) {
        setTimeout(() => {
          this.deletePermission(id);
        }, 1200); // Wait a bit so the "Copied!" feedback is visible
        return;
      }

      setTimeout(() => {
        this.permissions.update(perms =>
          perms.map(p => p.id === id && p.copiedField === field ? { ...p, copiedField: undefined } : p)
        );
      }, 1500);
    });
  }

  completePermission(id: string): void {
    this.permissions.update(perms =>
      perms.map(x => x.id === id ? { ...x, status: 'completed' } : x)
    );
    this.saveToHistory();
  }

  private formatPermission(p: ParsedPermission): string {
    return `Permission Name: ${p.permissionName}\nDescription: ${p.description}\nEndpoint: ${p.endpoint}\nMethod: ${p.method}`;
  }

  startEditing(p: ParsedPermission): void {
    this.permissions.update(perms =>
      perms.map(x => ({ ...x, editing: x.id === p.id }))
    );
  }

  saveEdit(p: ParsedPermission): void {
    this.permissions.update(perms =>
      perms.map(x => x.id === p.id ? { ...x, editing: false } : x)
    );
    this.saveToHistory();
  }

  updateField(id: string, field: keyof ParsedPermission, value: string): void {
    this.permissions.update(perms =>
      perms.map(x => x.id === id ? { ...x, [field]: value } : x)
    );
    this.saveToHistory();
  }

  deletePermission(id: string): void {
    this.permissions.update(perms => perms.filter(x => x.id !== id));
    this.saveToHistory();
  }

  addPermission(): void {
    const newP: ParsedPermission = {
      id: crypto.randomUUID(),
      permissionName: 'NEW_PERMISSION',
      description: 'Enter description',
      endpoint: '/api/endpoint',
      method: 'GET',
      copied: false,
      editing: true,
      status: 'active',
    };
    this.permissions.update(perms => [...perms, newP]);
  }

  goBack(): void {
    const currentStep = this.step();
    
    // Auto-save history BEFORE clearing if we are on review page
    if (currentStep === 'review') {
      this.saveToHistory();
      
      // Clear fields correctly when coming back from permissions
      this.serviceCode.set('');
      this.servicePrefix.set('');
      this.permissions.set([]);
      this.currentSessionId.set(null);
      this.step.set('input');
    } else if (currentStep === 'input') {
      // If we're on input page and go home, also save if data exists
      if (this.serviceCode() && this.servicePrefix()) {
        this.saveToHistory();
      }
      this.step.set('landing');
      this.resetMapping(); // Reuse reset logic
    } else {
      this.step.set('landing');
    }
    
    this.prefixTouched.set(false);
    this.parseError.set('');
    this.filterStatus.set('active');
    this.filterMethod.set('ALL');
    this.searchQuery.set('');
  }

  getMethodColor(method: string): string {
    const map: Record<string, string> = {
      GET: '#10b981',
      READ: '#10b981',
      POST: '#3b82f6',
      CREATE: '#3b82f6',
      PUT: '#f59e0b',
      UPDATE: '#f59e0b',
      DELETE: '#ef4444',
      PATCH: '#a855f7',
    };
    return map[method] || '#6c63ff';
  }

  trackById(_: number, p: ParsedPermission): string {
    return p.id;
  }

  get sampleCode(): string {
    return `import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCommonService } from '@libs/http-common';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  constructor(private httpService: HttpCommonService) { }

  getUsers(): Observable<any> {
    return this.httpService.getData('/workflow-management/workflow-admins');
  }

  createWorkflow(payload: any): Observable<any> {
    return this.httpService.postData('/workflow-management/workflow-details', payload);
  }

  deleteWorkflow(id: string): Observable<any> {
    return this.httpService.deleteData(\`/workflow-management/workflow-details/\${id}\`);
  }
}`;
  }
}
