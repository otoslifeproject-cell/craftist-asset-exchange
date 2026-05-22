import { createItemAction } from '../actions';

const tagHelp = 'PROP-BIG, AV-LIGHT, SCENIC, RETAIL, IMMERSIVE, FESTIVAL, CIRCULAR, ALL';

export default function NewItemPage() {
  return (
    <>
      <section className="hero">
        <div className="kicker">New asset</div>
        <h1>Feed the system once.</h1>
        <p>Add the asset sheet, drawings, images and buying terms. Then publish from the asset page when ready.</p>
      </section>

      <form action={createItemAction} className="grid" encType="multipart/form-data">
        <div className="card span-7 form">
          <h2>Core details</h2>
          <label>Title<input name="title" required placeholder="12ft Giant Cherry Bar / DJ Booth" /></label>
          <label>Description<textarea name="description" placeholder="What it is, what it was built for, and repurpose ideas." /></label>
          <label>Category<input name="category" placeholder="Giant prop / bar / scenic build" /></label>
          <label>Buyer tags<input name="tags" placeholder="PROP-BIG, FESTIVAL, IMMERSIVE" /><span className="help">Use: {tagHelp}</span></label>
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
          <label>Upload images / drawings / PDFs<input name="files" type="file" multiple /></label>
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
    </>
  );
}
