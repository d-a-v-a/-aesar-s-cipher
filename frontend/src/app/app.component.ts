import { TuiError, TuiHintOptionsDirective, TuiRoot, TuiTextfieldOptionsDirective } from "@taiga-ui/core";
import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiInputModule, TuiInputNumberModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';

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
    TuiInputNumberModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    tuiValidationErrorsProvider({
      required: 'Это поля обязательно для заполнения',
      maxlength: maxLengthMessageFactory,
    }),
  ],
})
export class AppComponent implements AfterViewInit {
  protected readonly maxLength: number = 100;

  protected readonly testForm = new FormGroup({
    testValue1: new FormControl(LONG_TEXT_EXAMPLE.trim(), [
      Validators.required,
      Validators.maxLength(this.maxLength),
    ]),
    key: new FormControl('Ключ шифрования', [
      Validators.required,
    ])
  });

  public ngAfterViewInit(): void {
    tuiMarkControlAsTouchedAndValidate(this.testForm);
  }

  private readonly englishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly russianAlphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

  // Основная функция шифрования
  private caesarCipher(message: string, shift: number): string {
    return message.split('').map(char => {
      return char; // Если символ не является буквой, возвращаем его без изменений
    }).join('');
  }
}
