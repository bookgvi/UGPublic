class ProfileSettings {
  constructor(parent) {
    this.photo = parent.querySelector('.profile-settings__image img');
    this.inputFile = parent.querySelector('.profile-settings__load');

    this.inputFile.addEventListener('change', this.encodeImageFileAsURL.bind(this));
  }

  encodeImageFileAsURL() {
    const filesSelected = this.inputFile.files;
    if (filesSelected.length > 0) {
      [this.fileToLoad] = filesSelected;
    }

    const fileReader = new window.FileReader();

    fileReader.onload = (fileLoadedEvent) => {
      const srcData = fileLoadedEvent.target.result;
      this.photo.src = srcData;
    };
    fileReader.readAsDataURL(this.fileToLoad);
  }
}

export default ProfileSettings;
