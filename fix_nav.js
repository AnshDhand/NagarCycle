const fs = require('fs');
const path = require('path');
const dir = path.join('c:', 'Users', 'hp', 'OneDrive', 'Desktop', 'NSUTPROJ', 'HACKATHON');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    let fp = path.join(dir, f);
    let c = fs.readFileSync(fp, 'utf8');

    let newUl = `<ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="listing.html">List Waste</a></li>
                    <li><a href="marketplace.html">Marketplace</a></li>
                    <li><a href="rewards.html">Rewards</a></li>
                    <li><a href="discarded.html">Discard Waste</a></li>
                    <li><a href="#" class="btn btn-secondary collector-portal-btn" style="padding: 10px 16px; font-size: 0.95rem; display: inline-block; width: 100%; text-align: center; margin-top: 5px; box-sizing: border-box;" onclick="openCollectorPortal()">Collector Portal</a></li>
                    <!-- Auth Item (Dynamic) -->
                    <li id="auth-item">
                        <a href="login.html" class="btn btn-primary" style="padding: 10px 16px; font-size: 0.95rem; color: black; display: inline-block; width: 100%; text-align: center; margin-top: 5px; box-sizing: border-box;">Login</a>
                    </li>
                </ul>`;

    // Add active class to current file link
    newUl = newUl.replace(new RegExp(`href="${f}"`), `class="active" href="${f}"`);

    // Replace the block exactly by using a regex that handles whitespace
    c = c.replace(/<ul class="nav-links">[\s\S]*?<\/ul>/g, newUl);

    // Also update any inline <style> block where `.nav-links a {` exists to be `.nav-links a:not(.btn) {` 
    // And give margin bottom to the li elements
    c = c.replace(/\.nav-links a:not\(\.btn\) \{/g, '.nav-links a:not(.btn) {');

    fs.writeFileSync(fp, c);
    console.log('Updated ' + f);
});
