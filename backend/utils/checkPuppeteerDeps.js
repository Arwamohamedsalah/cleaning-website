import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Check if required Puppeteer dependencies are installed
 * @returns {Promise<{installed: boolean, missing: string[], command: string}>}
 */
export const checkPuppeteerDependencies = async () => {
  const requiredLibs = [
    'libasound2',
    'libatk-bridge2.0-0',
    'libatk1.0-0',
    'libcairo2',
    'libcups2',
    'libdbus-1-3',
    'libfontconfig1',
    'libgbm1',
    'libgtk-3-0',
    'libnspr4',
    'libnss3',
    'libpango-1.0-0',
    'libx11-6',
    'libxcomposite1',
    'libxdamage1',
    'libxfixes3',
    'libxrandr2',
    'libxrender1',
    'libxss1',
  ];

  const missing = [];
  const installed = [];

  try {
    // Check each library
    for (const lib of requiredLibs) {
      try {
        // Try to check if package is installed (dpkg for Debian/Ubuntu)
        const { stdout } = await execAsync(`dpkg -l | grep -i ${lib} || echo "not found"`);
        if (stdout.includes('not found') || stdout.trim() === '') {
          missing.push(lib);
        } else {
          installed.push(lib);
        }
      } catch (error) {
        // If dpkg check fails, try alternative method
        try {
          await execAsync(`ldconfig -p | grep ${lib} || echo "not found"`);
          installed.push(lib);
        } catch {
          missing.push(lib);
        }
      }
    }

    // Generate install command
    const installCommand = missing.length > 0
      ? `sudo apt-get update && sudo apt-get install -y ${missing.join(' ')}`
      : null;

    return {
      installed: missing.length === 0,
      missing,
      installed: installed.length,
      total: requiredLibs.length,
      installCommand,
    };
  } catch (error) {
    console.error('❌ Error checking dependencies:', error);
    return {
      installed: false,
      missing: requiredLibs,
      installed: 0,
      total: requiredLibs.length,
      installCommand: `sudo apt-get update && sudo apt-get install -y ${requiredLibs.join(' ')}`,
    };
  }
};

/**
 * Attempt to install missing dependencies (requires sudo)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const installPuppeteerDependencies = async () => {
  try {
    const check = await checkPuppeteerDependencies();
    
    if (check.installed) {
      return {
        success: true,
        message: 'All dependencies are already installed',
      };
    }

    if (!check.installCommand) {
      return {
        success: false,
        message: 'No install command available',
      };
    }

    console.log('📦 Installing missing Puppeteer dependencies...');
    console.log('⚠️  This requires sudo privileges');
    
    // Try to install (this will fail if no sudo, but that's okay)
    try {
      const { stdout, stderr } = await execAsync(check.installCommand, {
        timeout: 300000, // 5 minutes timeout
      });
      
      console.log('✅ Installation output:', stdout);
      if (stderr) {
        console.warn('⚠️  Installation warnings:', stderr);
      }
      
      return {
        success: true,
        message: 'Dependencies installed successfully',
      };
    } catch (error) {
      // Installation failed (probably no sudo)
      console.error('❌ Auto-installation failed:', error.message);
      console.log('📝 Please run manually:');
      console.log(check.installCommand);
      
      return {
        success: false,
        message: `Auto-installation failed. Please run manually:\n${check.installCommand}`,
        command: check.installCommand,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
};

export default {
  checkPuppeteerDependencies,
  installPuppeteerDependencies,
};

