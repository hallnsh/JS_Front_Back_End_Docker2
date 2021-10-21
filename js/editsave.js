// ---------------------------------------------------------------------------------------------------- 
// --------           Javascript hack to implement the 2 functions                             --------
// --------           editProfile()    gets invoked when you click the edit profile button     -------- 
// --------           saveProfile()    gets invoked when you click the save profile button     --------
// --------                                                                                    --------
// --------           'container' and 'container-edit' are classes and so are referrenced      --------
// --------           using the dot prefix, '.container'  and '.container-edit'  but           --------
// --------           'name', 'input-name', 'email', 'input-email' etc are identifiers (id)    --------
// --------           and are referrenced using the # prefix with '#name', '#input-name' etc   --------
// --------           this is exactly the same syntax used in CSS.                             --------      
// ----------------------------------------------------------------------------------------------------           
function editProfile() {
    document.querySelector(".container").style.display = 'none';
    document.querySelector(".container-edit").style.display = 'block';

    let name = document.querySelector('#name').textContent;
    document.querySelector('#input-name').value = name;
    
    let email = document.querySelector('#email').textContent;
    document.querySelector('#input-email').value = email;
    
    let interests = document.querySelector('#interests').textContent;
    document.querySelector('#input-interests').value = interests;
      
}
// ----------------------------------------------------------------------------------------------------
function saveProfile() {
    document.querySelector('#name').textContent = document.querySelector('#input-name').value;
    document.querySelector('#email').textContent = document.querySelector('#input-email').value;
    document.querySelector('#interests').textContent = document.querySelector('#input-interests').value;
    
    document.querySelector(".container").style.display = 'block';
    document.querySelector(".container-edit").style.display = 'none';
}