'use client';

import { useMemo, useRef, useState } from 'react';
import { createItemAction } from '../actions';

const CANONICAL_TAGS = [
  'PROP-BIG',
  'GIANT-PROP',
  'BAR',
  'DJ-BOOTH',
  'PHOTO-MOMENT',
  'SCENIC',
  'THEMED-BUILD',
  'FESTIVAL',
  'IMMERSIVE',
  'RETAIL',
  'POP-UP',
  'SHOP-DISPLAY',
  'EXHIBITION',
  'ESCAPE-ROOM',
  'ATTRACTION',
  'AV-LIGHT',
  'LIGHTING',
  'LED-SCREEN',
  'SPEAKER-SYSTEM',
  'TRUSS',
  'INDOOR',
  'OUTDOOR',
  'CIRCULAR',
  'ALL'
];

function normaliseTag(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/&/g, ' AND ')
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42);
}

function splitTags(value: string) {
  return value
    .split(/[\n,;]+|\s+\/\s+/g)
    .map(normaliseTag)
    .filter(Boolean);
}

function fileSize(bytes: number) {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function inferTags(title: string, category: string, description: string) {
  const haystack = `${title} ${category} ${description}`.toLowerCase();
  const inferred = new Set<string>();

  const rules: Array<[string[], string[]]> = [
    [['cherry', 'giant', 'oversized', 'sculpture'], ['PROP-BIG', 'GIANT-PROP', 'PHOTO-MOMENT']],
    [['bar', 'counter', 'serve'], ['BAR']],
    [['dj', 'booth'], ['DJ-BOOTH']],
    [['festival', 'outdoor'], ['FESTIVAL', 'OUTDOOR']],
    [['immersive', 'escape', 'experience'], ['IMMERSIVE']],
    [['retail', 'shop', 'window', 'display'], ['RETAIL', 'SHOP-DISPLAY']],
    [['exhibition', 'stand', 'expo'], ['EXHIBITION']],
    [['lighting', 'light'], ['AV-LIGHT', 'LIGHTING']],
    [['screen', 'led', 'video'], ['AV-LIGHT', 'LED-SCREEN']],
    [['speaker', 'sound', 'audio'], ['AV-LIGHT', 'SPEAKER-SYSTEM']],
    [['truss', 'rigging'], ['TRUSS']],
    [['set', 'scenic', 'stage'], ['SCENIC', 'THEMED-BUILD']]
  ];

  for (const [needles, tags] of rules) {
    if (needles.some((needle) => haystack.includes(needle))) {
      tags.forEach((tag) => inferred.add(tag));
    }
  }

  return Array.from(inferred);
}

export default function AssetCreateForm({ existingTags = [] }: { existingTags?: string[] }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const allSuggestions = useMemo(() => {
    const inferred = inferTags(title, category, description);
    return Array.from(new Set([...inferred, ...CANONICAL_TAGS, ...existingTags.map(normaliseTag)]))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [title, category, description, existingTags]);

  const visibleSuggestions = useMemo(() => {
    const query = normaliseTag(tagInput);
    return allSuggestions
      .filter((tag) => !tags.includes(tag))
      .filter((tag) => !query || tag.includes(query))
      .slice(0, 14);
  }, [allSuggestions, tags, tagInput]);

  function addTags(nextTags: string[]) {
    setTags((current) => {
      const merged = new Set(current);
      nextTags.map(normaliseTag).filter(Boolean).forEach((tag) => merged.add(tag));
      return Array.from(merged);
    });
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags((current) => current.filter((item) => item !== tag));
  }

  function commitTagInput() {
    const next = splitTags(tagInput);
    if (next.length) addTags(next);
  }

  function applyFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const incoming = Array.from(fileList);
    setFiles((current) => {
      const map = new Map(current.map((file) => [`${file.name}-${file.size}-${file.lastModified}`, file]));
      incoming.forEach((file) => map.set(`${file.name}-${file.size}-${file.lastModified}`, file));
      const merged = Array.from(map.values());
      const dataTransfer = new DataTransfer();
      merged.forEach((file) => dataTransfer.items.add(file));
      if (fileInputRef.current) fileInputRef.current.files = dataTransfer.files;
      return merged;
    });
  }

  function clearFile(index: number) {
    setFiles((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      const dataTransfer = new DataTransfer();
      next.forEach((file) => dataTransfer.items.add(file));
      if (fileInputRef.current) fileInputRef.current.files = dataTransfer.files;
      return next;
    });
  }

  return (
    <form action={createItemAction} className="grid" encType="multipart/form-data">
      <div className="card span-7 form">
        <h2>Core details</h2>
        <label>Title<input name="title" required placeholder="12ft Giant Cherry Bar / DJ Booth" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>Description<textarea name="description" placeholder="What it is, what it was built for, and repurpose ideas." value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label>Category<input name="category" placeholder="Giant prop / bar / scenic build" value={category} onChange={(event) => setCategory(event.target.value)} /></label>

        <div className="tag-panel">
          <div className="tag-panel-head">
            <div>
              <strong>Buyer tags</strong>
              <span>Type, choose suggestions, then confirm each tag as a chip.</span>
            </div>
            <button className="mini-button" type="button" onClick={() => addTags(inferTags(title, category, description))}>Auto-suggest</button>
          </div>

          <input type="hidden" name="tags" value={tags.join(', ')} />
          <div className="tag-lockbox" aria-label="Confirmed buyer tags">
            {tags.map((tag) => (
              <button className="tag-chip locked" type="button" key={tag} onClick={() => removeTag(tag)} title="Click to remove">
                {tag}<span>×</span>
              </button>
            ))}
            {!tags.length ? <span className="tag-empty">No locked tags yet.</span> : null}
          </div>

          <div className="tag-entry-row">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onBlur={commitTagInput}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  commitTagInput();
                }
              }}
              placeholder="Start typing: cherry, bar, festival, AV..."
            />
            <button className="button green" type="button" onMouseDown={(event) => event.preventDefault()} onClick={commitTagInput}>Lock tag</button>
          </div>

          <div className="tag-suggestions" aria-label="Tag suggestions">
            {visibleSuggestions.map((tag) => (
              <button type="button" className="tag-chip suggestion" key={tag} onMouseDown={(event) => event.preventDefault()} onClick={() => addTags([tag])}>{tag}</button>
            ))}
          </div>
        </div>

        <div className="grid">
          <label className="span-6">Dimensions<input name="dimensions" placeholder="12ft x 12ft x 12ft" /></label>
          <label className="span-6">Dispatch postcode<input name="dispatch_postcode" placeholder="CB25..." /></label>
        </div>
        <label>Location notes<input name="location_notes" placeholder="Direct dispatch from manufacturer / return site" /></label>
        <div className="grid">
          <label className="span-6">Available from<input name="availability_start" type="datetime-local" /></label>
          <label className="span-6">Decision deadline<input name="decision_deadline" type="datetime-local" /></label>
        </div>
      </div>

      <div className="card span-5 form">
        <h2>Price + files</h2>
        <label>Asset price GBP<input name="guide_price" inputMode="decimal" placeholder="4500" /></label>
        <label>Transport price GBP<input name="transport_price" inputMode="decimal" placeholder="0 or agreed delivery cost" /></label>
        <input type="hidden" name="currency" value="gbp" />
        <input type="hidden" name="status" value="draft" />

        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            applyFiles(event.dataTransfer.files);
          }}
        >
          <input ref={fileInputRef} name="files" type="file" multiple className="file-input" onChange={(event) => applyFiles(event.target.files)} />
          <div className="drop-icon">⇩</div>
          <strong>Drag files here</strong>
          <span>Images, drawings, PDFs, assembly instructions, price sheets.</span>
          <button className="button green" type="button" onClick={() => fileInputRef.current?.click()}>Choose files</button>
        </div>

        {files.length ? (
          <div className="file-list">
            {files.map((file, index) => (
              <div className="file-pill" key={`${file.name}-${file.size}-${file.lastModified}`}>
                <span>{file.name}<small>{fileSize(file.size)}</small></span>
                <button type="button" onClick={() => clearFile(index)}>Remove</button>
              </div>
            ))}
          </div>
        ) : null}

        <label>Image URLs, one per line<textarea name="image_urls" placeholder="https://..." /></label>
        <label>File URLs, one per line<textarea name="file_urls" placeholder="https://...asset-sheet.pdf" /></label>
      </div>

      <div className="card span-6 form">
        <h2>Buyer terms</h2>
        <label>Included<textarea name="included" placeholder="Structure, counters, fixings, lighting, drawings, assembly instructions..." /></label>
        <label>Exclusions<textarea name="exclusions" placeholder="Install crew, storage, certification, venue approval..." /></label>
        <label>Transport notes<textarea name="transport_notes" placeholder="Direct dispatch. Buyer postcode required. Offload/lifting by buyer unless agreed." /></label>
      </div>

      <div className="card span-6 form">
        <h2>Risk notes</h2>
        <label>Compliance notes<textarea name="compliance_notes" placeholder="Fire rating, electrical status, decorative only/load-bearing, indoor/outdoor suitability." /></label>
        <label>Condition notes<textarea name="condition_notes" placeholder="Used once, post-event condition, inspection status." /></label>
        <label>Assembly notes<textarea name="assembly_notes" placeholder="Requires competent installers / instructions included." /></label>
      </div>

      <div className="span-12" style={{ paddingBottom: 40 }}>
        <button className="button gold" type="submit">Create draft asset</button>
      </div>
    </form>
  );
}
