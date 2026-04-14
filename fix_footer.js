const fs = require('fs');
const path = require('path');
const dir = path.join('c:', 'Users', 'hp', 'OneDrive', 'Desktop', 'NSUTPROJ', 'HACKATHON');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newFooter = `    <footer>
        <div class="container">
            <div class="footer-content" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2rem;">
                <div style="flex: 1; min-width: 250px;">
                    <a href="index.html" class="logo" style="display: flex; align-items: center; text-decoration: none; margin-bottom: 1rem;">
                        <img src="logo_final.jpg" alt="Logo" style="height: 40px; width: auto; margin-right: 10px; border-radius: 4px;">
                        <span style="font-size: 1.2rem; font-weight: bold; color: var(--text-color);">नगर<span style="font-family: sans-serif;">CYCLE</span></span>
                    </a>
                    <p style="color: var(--text-light); font-size: 0.9rem;">Empowering the circular economy one connection at a time. Trade, recycle, and manage waste responsibly.</p>
                </div>
                
                <div style="flex: 1; min-width: 150px;">
                    <h4>Platform</h4>
                    <ul style="margin-top: 1rem; list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem;"><a href="listing.html" style="color: var(--text-light); text-decoration: none; transition: color 0.2s;">List Waste</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="marketplace.html" style="color: var(--text-light); text-decoration: none; transition: color 0.2s;">Marketplace</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="discarded.html" style="color: var(--text-light); text-decoration: none; transition: color 0.2s;">Discard Waste</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="tracking.html" style="color: var(--text-light); text-decoration: none; transition: color 0.2s;">Impact Tracking</a></li>
                    </ul>
                </div>

                <div style="flex: 1; min-width: 150px;">
                    <h4>Company</h4>
                    <ul style="margin-top: 1rem; list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem;"><a href="about.html" style="color: var(--text-light); text-decoration: none; transition: color 0.2s;">About Us</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="rewards.html" style="color: var(--text-light); text-decoration: none; transition: color 0.2s;">Rewards Program</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="mailto:contact@nagarcycle.colab" style="color: var(--text-light); text-decoration: none; transition: color 0.2s;">Contact Us</a></li>
                    </ul>
                </div>
            </div>
            
            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-light); font-size: 0.85rem;">
                &copy; 2026 NagarCycle. All rights reserved.
            </div>
        </div>
    </footer>`;

let updatedCount = 0;

files.forEach(f => {
    let fp = path.join(dir, f);
    let c = fs.readFileSync(fp, 'utf8');

    // Replace everything from <footer> or <footer ...> up to </footer>
    if (c.match(/<footer[\s\S]*?<\/footer>/)) {
        c = c.replace(/<footer[\s\S]*?<\/footer>/, newFooter);
        fs.writeFileSync(fp, c);
        console.log('Updated ' + f);
        updatedCount++;
    }
});

console.log('Total files updated: ' + updatedCount);
