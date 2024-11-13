import { TuiButton, TuiError, TuiHintOptionsDirective, TuiRoot, TuiTextfieldOptionsDirective } from "@taiga-ui/core";
import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiInputModule, TuiInputNumberModule, TuiTextareaModule } from '@taiga-ui/legacy';
import {
  TuiButtonLoading,
  TuiFieldErrorPipe,
  TuiSwitch,
  tuiSwitchOptionsProvider,
  tuiValidationErrorsProvider
} from '@taiga-ui/kit';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';
import * as buffer from 'buffer';
import { Language } from './enums/language.enum';

const LONG_TEXT_EXAMPLE = `
ДА ЗДРАВСТВУЮТ МУЗЫ, ДА ЗДРАВСТВУЕТ РАЗУМ
`;

export function maxLengthMessageFactory(context: { requiredLength: string }): string {
  return `Maximum length — ${context.requiredLength}`;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TuiRoot,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiError,
    TuiHintOptionsDirective,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiInputModule,
    TuiTextfieldOptionsDirective,
    TuiInputNumberModule,
    TuiButton,
    TuiButtonLoading,
    TuiSwitch,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    tuiValidationErrorsProvider({
      required: 'Это поля обязательно для заполнения',
      maxlength: maxLengthMessageFactory,
    }),
    tuiSwitchOptionsProvider({showIcons: false, appearance: () => 'primary'}),
  ],
})
export class AppComponent implements AfterViewInit {
  protected readonly maxLength: number = 10000;

  public loading: boolean = false;

  protected readonly cryptForm = new FormGroup({
    encrypt: new FormControl<string>(LONG_TEXT_EXAMPLE.trim(), [
      Validators.maxLength(this.maxLength),
    ]),
    decrypt: new FormControl<string>('', [
      Validators.maxLength(this.maxLength),
    ]),
    m: new FormControl<number>(3, [
      Validators.required,
    ]),
    language: new FormControl(false, [
      Validators.required,
    ])
  });

  public ngAfterViewInit(): void {
    tuiMarkControlAsTouchedAndValidate(this.cryptForm);
  }

  private readonly englishAlphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  private readonly russianAlphabet: string[] = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

  /** Зашифровать */
  public encrypt(): void {
    this.loading = true;
    const encryptControl: FormControl<string | null> = this.cryptForm.controls['encrypt'];
    const decryptControl: FormControl<string | null> = this.cryptForm.controls['decrypt'];
    const shift: number = this.cryptForm.controls['m'].value || 0;
    const alphabet: string[] = !!this.cryptForm.controls['language'].value ? this.englishAlphabet : this.russianAlphabet;

    let text: string = encryptControl.value?.trim() || '';

    text = text
      .split('')
      .map((x: string) => x.toUpperCase())
      .filter((x: string) => alphabet.includes(x))
      .map((char: string): string => {
        const index: number = (alphabet.indexOf(char) + shift) % alphabet.length;

        return alphabet[index];
      }).join('');
    decryptControl.setValue(text);
    this.loading = false;
  }

  /** Расшифровать */
  public decrypt(): void {

  }
}
