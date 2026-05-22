'use client';

import { useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

type ServerAction = (formData: FormData) => void | Promise<void>;

const TAG_LIBRARY = [
  'ALL',
  'ATTRACTION',
  'AV-LIGHT',
  'BAR',
  'CIRCULAR',
  'DJ-BOOTH',
  'ESCAPE-ROOM',
  'EXHIBITION',
  'FESTIVAL',
  'GIANT-PROP',
  'IMMERSIVE',
  'INDOOR',
  'LED-SCREEN',
  'LIGHTING',
  'OUTDOOR',
  'PHOTO-MOMENT',
  'PROP-BIG',
  'RETAIL',
  'SCENIC',
  'SEASONAL',
  'STAGE-SET',
  'THEMING'
];

function normaliseTag(value: string) {
  return value
    .trim()
    .replace(/,/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase();
}

function tagLabel(value: string) {
  return value.replace(/-/g, ' ');
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button gold form-submit-button" type="submit" disabled={pending}>
      {pending ? 'Creating draft…' : 'Create draft asset'}
    </button>
  );
}

export default function NewItemForm({ action }: { action: ServerAction }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const draftTag = normaliseTag(tagInput);

  const filteredSuggestions = useMemo(() => {
    const available = TAG_LIBRARY.filter((tag) => !selectedTags.includes(tag));

    if (!draftTag) return available;

    const filtered = available.filter((tag) => tag.includes(draftTag) || tagLabel(tag).includes(tagInput.toUpperCase()));

    if (draftTag && !selectedTags.includes(draftTag) && !available.includes(draftTag)) {
      return [draftTag, ...filtered];
    }

    return filtered;
  }, [draftTag, selectedTags, tagInput]);

  function addTag(raw: string) {
    const next = normaliseTag(raw);
    if (!next) return;

    setSelectedTags((current) => (current.includes(next) ? current : [...current, next]));
    setTagInput('');
  }

  function removeTag(tag: string) {
    setSelectedTags((current) => current.filter((item) => item !== tag));
  }

  function toggleSuggestion(tag: string) {
    if (selectedTags.includes(tag)) {
      removeTag(tag);
      return;
    }
    addTag(tag);
  }

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',' || event.key === 'Tab') {
      if (draftTag) {
        event.preventDefault();
        addTag(draftTag);
      }
    }
  }

  function syncFiles(fileList: FileList | null) {
    if (!fileList) {
      setFiles([]);
      return;
    }
    setFiles(Array.from(fileList));
  }

  function handleInputFiles(event: React.ChangeEvent<HTMLInputElement>) {
    syncFiles(event.target.files);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (!droppedFiles.length) return;

    const transfer = new DataTransfer();
    droppedFiles.forEach((file) => transfer.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = transfer.files;
    }

    setFiles(droppedFiles);
  }

  return (
    <div className="new-asset-page">
      <section className="hero hero-premium hero-premium--asset">
        <div className="kicker">New asset</div>
        <h1>Build the opportunity sheet.</h1>
        <p>
          Make this feel less like admin and more like a premium intake flow: define the asset,
          match the audience, add the files, then create a clean draft ready for review.
        </p>

        <div className="journey-strip">
          <div className="journey-chip">
            <span>01</span>
            <strong>Shape it</strong>
            <small>Title, description, category</small>
          </div>
          <div className="journey-chip">
            <span>02</span>
            <strong>Match it</strong>
            <small>Tags, timing, location</small>
          </div>
          <div className="journey-chip">
            <span>03</span>
            <strong>Package it</strong>
            <small>Price, images, files</small>
          </div>
          <div className="journey-chip">
            <span>04</span>
            <strong>Finish it</strong>
            <small>Terms, risk notes, draft</small>
          </div>
        </div>
      </section>

      <form action={action} className="grid new-asset-form" encType="multipart/form-data">
        <input type="hidden" name="tags" value={selectedTags.join(', ')} readOnly />
        <input type="hidden" name="currency" value="gbp" />
        <input type="hidden" name="status" value="draft" />

        <div className="card span-7 section-card">
          <div className="section-stephead">
            <div className="step-badge">01</div>
            <div>
              <div className="section-kicker">Core story</div>
              <h2>Describe the asset clearly.</h2>
              <p className="section-intro">
                Start with the headline and what the piece actually is. This is the first thing the
                internal team will review before anything goes live.
              </p>
            </div>
          </div>

          <div className="form-stack">
            <label>
              Title
              <input name="title" required placeholder="12ft Giant Cherry Bar / DJ Booth" />
            </label>

            <label>
              Description
              <textarea
                name="description"
                placeholder="What it is, what it was built for, its visual impact, and repurpose ideas."
              />
            </label>

            <label>
              Category
              <input name="category" placeholder="Giant prop / bar / scenic build" />
            </label>
          </div>

          <div className="tag-panel">
            <div className="tag-panel-head">
              <div>
                <h3>Buyer tags</h3>
                <p>
                  Type a tag and hit Enter, or tap a suggestion. Selected tags stay visible as soft chips.
                </p>
              </div>
            </div>

            <div className="selected-tags-wrap">
              <div className="selected-tags-label">Selected tags</div>
              <div className="selected-tags">
                {selectedTags.length ? (
                  selectedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="soft-chip soft-chip--active"
                      onClick={() => removeTag(tag)}
                    >
                      <span>{tagLabel(tag)}</span>
                      <strong>×</strong>
                    </button>
                  ))
                ) : (
                  <div className="soft-empty">No tags selected yet.</div>
                )}
              </div>
            </div>

            <div className="tag-entry-row">
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Start typing: cherry, bar, festival, AV..."
              />
              <button
                type="button"
                className="button green tag-add-button"
                onClick={() => addTag(tagInput)}
              >
                Add tag
              </button>
            </div>

            <div className="suggestion-block">
              <div className="suggestion-title">Suggestions</div>
              <div className="suggestion-grid">
                {filteredSuggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`soft-chip ${selectedTags.includes(tag) ? 'soft-chip--active' : ''}`}
                    onClick={() => toggleSuggestion(tag)}
                  >
                    {tagLabel(tag)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card span-5 section-card section-card--sticky">
          <div className="section-stephead">
            <div className="step-badge">02</div>
            <div>
              <div className="section-kicker">Price + files</div>
              <h2>Package the opportunity.</h2>
              <p className="section-intro">
                Add the commercial details and any supporting files so the draft already feels complete.
              </p>
            </div>
          </div>

          <div className="form-stack">
            <label>
              Asset price GBP
              <input name="guide_price" inputMode="decimal" placeholder="4500" />
            </label>

            <label>
              Transport price GBP
              <input name="transport_price" inputMode="decimal" placeholder="0 or agreed delivery cost" />
            </label>

            <div className="upload-zone-group">
              <div className="upload-zone-label">Images, drawings and PDFs</div>

              <input
                ref={fileInputRef}
                className="sr-only"
                name="files"
                type="file"
                multiple
                onChange={handleInputFiles}
              />

              <div
                className={`upload-dropzone ${dragActive ? 'is-dragging' : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-mark">↗</div>
                <div className="upload-copy">
                  <strong>Drag files here</strong>
                  <span>Drop imagery, drawings, PDFs, assembly notes or price sheets.</span>
                </div>
                <button
                  type="button"
                  className="button green"
                  onClick={(event) => {
                    event.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose files
                </button>
              </div>

              {files.length ? (
                <div className="file-list">
                  {files.map((file) => (
                    <div className="file-item" key={`${file.name}-${file.size}`}>
                      <span className="file-name">{file.name}</span>
                      <small>{Math.max(1, Math.round(file.size / 1024))} KB</small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="upload-hint">No files added yet.</div>
              )}
            </div>

            <label>
              Image URLs, one per line
              <textarea name="image_urls" placeholder="https://..." />
            </label>

            <label>
              File URLs, one per line
              <textarea name="file_urls" placeholder="https://...asset-sheet.pdf" />
            </label>
          </div>
        </div>

        <div className="card span-7 section-card">
          <div className="section-stephead">
            <div className="step-badge">03</div>
            <div>
              <div className="section-kicker">Fit + timing</div>
              <h2>Set the logistics.</h2>
              <p className="section-intro">
                Keep the practical details together so the reviewer can understand where it is, when it
                is available, and how fast a buyer needs to move.
              </p>
            </div>
          </div>

          <div className="grid compact-grid">
            <label className="span-6">
              Dimensions
              <input name="dimensions" placeholder="12ft x 12ft x 12ft" />
            </label>

            <label className="span-6">
              Dispatch postcode
              <input name="dispatch_postcode" placeholder="CB25..." />
            </label>

            <label className="span-12">
              Location notes
              <input name="location_notes" placeholder="Direct dispatch from manufacturer / return site" />
            </label>

            <label className="span-6">
              Available from
              <input name="availability_start" type="datetime-local" />
            </label>

            <label className="span-6">
              Decision deadline
              <input name="decision_deadline" type="datetime-local" />
            </label>
          </div>
        </div>

        <div className="card span-5 section-card">
          <div className="section-stephead">
            <div className="step-badge">04</div>
            <div>
              <div className="section-kicker">Commercial notes</div>
              <h2>Clarify what’s included.</h2>
              <p className="section-intro">
                This is the clean handover layer — what’s included, what is not, and any transport specifics.
              </p>
            </div>
          </div>

          <div className="form-stack">
            <label>
              Included
              <textarea
                name="included"
                placeholder="Structure, counters, fixings, lighting, drawings, assembly instructions..."
              />
            </label>

            <label>
              Exclusions
              <textarea
                name="exclusions"
                placeholder="Install crew, storage, certification, venue approval..."
              />
            </label>

            <label>
              Transport notes
              <textarea
                name="transport_notes"
                placeholder="Direct dispatch. Buyer postcode required. Offload/lifting by buyer unless agreed."
              />
            </label>
          </div>
        </div>

        <div className="card span-12 section-card section-card--soft">
          <div className="section-stephead">
            <div className="step-badge">05</div>
            <div>
              <div className="section-kicker">Risk notes</div>
              <h2>Capture anything that protects the deal.</h2>
              <p className="section-intro">
                These notes do not need to be dramatic — just enough to help internal review and keep the asset page clean later.
              </p>
            </div>
          </div>

          <div className="grid compact-grid">
            <label className="span-4">
              Compliance notes
              <textarea
                name="compliance_notes"
                placeholder="Fire rating, electrical status, decorative only/load-bearing, indoor/outdoor suitability."
              />
            </label>

            <label className="span-4">
              Condition notes
              <textarea
                name="condition_notes"
                placeholder="Used once, post-event condition, inspection status."
              />
            </label>

            <label className="span-4">
              Assembly notes
              <textarea
                name="assembly_notes"
                placeholder="Requires competent installers / instructions included."
              />
            </label>
          </div>
        </div>

        <div className="span-12">
          <div className="submit-bar">
            <div className="submit-copy">
              <div className="submit-kicker">Ready for review</div>
              <h3>Create the draft asset</h3>
              <p>
                This saves the record as a draft. You can tighten the page, inspect the files and publish when ready.
              </p>
            </div>
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}
