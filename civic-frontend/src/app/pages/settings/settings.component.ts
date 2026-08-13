import { Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
    import { MatCardModule } from '@angular/material/card';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatInputModule } from '@angular/material/input';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';
    import { MatDividerModule } from '@angular/material/divider';
    import { MatTabsModule } from '@angular/material/tabs';
    import { AuthService } from '../../services/auth.service';
    import { ToastService } from '../../services/toast.service';

    @Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule, MatTabsModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
    })
    export class SettingsComponent {
    auth = inject(AuthService);
    private toast = inject(ToastService);
    private fb = inject(FormBuilder);

    get user() { return this.auth.getUser(); }

    profileForm = this.fb.group({
      name: [this.user?.name || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      location: [this.user?.location || '', Validators.required]
    });

    passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    saveProfile(): void { if(this.profileForm.invalid)return; this.auth.updateProfile({name:this.profileForm.value.name!,email:this.profileForm.value.email!,location:this.profileForm.value.location!}).subscribe({next:()=>this.toast.success('Profile updated successfully.'),error:e=>this.toast.error(e.error?.message||'Profile update failed.')}); }
    changePassword(): void { if(this.passwordForm.invalid)return; this.auth.changePassword({currentPassword:this.passwordForm.value.currentPassword!,newPassword:this.passwordForm.value.newPassword!,confirmPassword:this.passwordForm.value.confirmPassword!}).subscribe({next:()=>{this.toast.success('Password changed successfully.');this.passwordForm.reset();},error:e=>this.toast.error(e.error?.message||'Password change failed.')}); }
    }
    