const path = require('path')
const url = require('url')
const { app, BrowserWindow, Menu } = require('electron')

app.setName('Deplacement');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

function createWindow() {
	const windowOptions = {
		width: 1300,
		height: 600,
		resizable: false,
		title: app.getName()
	};

	mainWindow = new BrowserWindow(windowOptions);

	let template = [{
		label: 'File',
		submenu: [{
			label: 'Save',
			accelerator: 'CmdOrCtrl+S',
			click: (item, focusedWindow) => {
				console.log("Sauvegarder")
			}
		}, {
			label: 'Export',
			accelerator: 'Shift+CmdOrCtrl+S',
			click: (item, focusedWindow) => {
				console.log("Exporter")
			}
		}, {
			type: 'separator'
		}, {
			label: 'Preferences',
			click: (item, focusedWindow) => {
				console.log("Ouverture modale")
			}
		}, {
			type: 'separator'
		}, {
			label: 'Exit',
			accelerator: 'CmdOrCtrl+W',
			role: 'close'
		}]
	}, {
		label: 'View',
		submenu: [{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click: (item, focusedWindow) => {
				if (focusedWindow) {
					// on reload, start fresh and close any old
					// open secondary windows
					if (focusedWindow.id === 1) {
						BrowserWindow.getAllWindows().forEach(win => {
							if (win.id > 1) win.close()
						})
					}
					focusedWindow.reload()
				}
			}
		}, {
			label: 'Toggle Developer Tools',
			accelerator: (() => {
				if (process.platform === 'darwin') {
					return 'Alt+Command+I'
				} else {
					return 'Ctrl+Shift+I'
				}
			})(),
			click: (item, focusedWindow) => {
				if (focusedWindow) {
					focusedWindow.toggleDevTools()
				}
			}
		}]
	}];


	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);


	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin')
		app.quit();
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null)
		createWindow();
})