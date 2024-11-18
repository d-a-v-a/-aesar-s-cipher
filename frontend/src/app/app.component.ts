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

const ENCRYPT_TEXT_EXAMPLE = `
ДА ЗДРАВСТВУЮТ МУЗЫ, ДА ЗДРАВСТВУЕТ РАЗУМ
`;

const DECRYPT_TEXT_EXAMPLE = `
РЬАЬА ШЮЙАП ОЩОСО ЫЕЦШТ ЩНРУЯ УЩЙГЦ ЯЩОРЫ ЙГТУА УЧЯЪЬ АЮНАТ УРЬЕШ ОЦЪОЩ
КЕЦШЫ ОТОЪШ ЬЮЬЩУ ЧЦЕУЮ АУЧЦХ РБЕЦА ЛАООТ ЯШОНЪ БХЙШО ХОРЙР ОУАБЫ ЙЩЙЧЯ
ЪЙЕЬШ ЯАЮОЖ ЫЙЧЕУ ЮАБГР ОАЦЩШ ОЮОЭБ ХЦШОЦ ЯАУШО УАШЩМ ШРУЫЫ ЙЧЯЬШ ЪОЩКЕ
ЦШЬЫЯ ЭОЯУА ЯНЬАЕ УЮЫЬС ЬСЫУР ОЪОЫЬ РУЫЦУ ЪПУЩЬ ЧЮБШЦ ЭЬЯЪЬ АЮЦЬС ЬЫКШЦ
ЭЮЦПЩ ЦФОМА ЯНЯЩУ РОРЦТ ЦЖКВО ШУЩЙР ЦТЦЖК ТЙЪШЦ ЛАЬРУ ЮЫЬЯО ЪОШЬЮ ЬЩУРО
ТУРЬЕ ШООГЫ УАХОЕ УЪАЙТ ЮОХЫЦ ЖКЪУЫ НЛАЬО ТЯШОН ЯРЦАО ШЬЮЬЩ УРОАО ГЬТЦА
ЯЮУТК ПУЩЬС ЬТЫНР ЯНСЦЮ ЩНЫТО ЪЦЮЬХ ЭУЮУР ЦАОЦЖ ЩУЧВУ УЫЬЯЦ АЪУЕО ЪЦХРУ
ЫНРХТ ЙГОМЗ ЦГЮЙД ОЮУЧЯ РЦАОР ТЮБСЭ ОНДЭУ ЮУСЫБ ЩЯНХО ЮОЪЭБ ЦШЮЦЕ ЦАЭЬЪ
ЬСЦАУ ЦЯАУШ ОМНШЩ МШРУЫ ЫЙЪЯЬ ШЬЪХО ПЦЫАЬ РОЫАЮ НЭЦДУ ЧЫОСЬ ЩЬРУЪ ЬУЧШО
ЮАЬЫЫ ЙЧЖЩУ ЪОРЮБ ШУТУЮ УРНЫЫ ЙЧЪУЕ ХОЭЩО ШОЩЦТ УРЬЕШ ОЦЪОЩ КЕЦШЦ ХОШЮЙ
ЩЯНРУ ЯУЩЙЧ ПОЩОС ОЫЕЦШ

`;
interface IFrequencies {
  [key: string]: number
}

const russianLetterFrequencies: IFrequencies = {
  "о": 0.090,
  "е": 0.072,
  "а": 0.062,
  "и": 0.062,
  "н": 0.053,
  "т": 0.053,
  "с": 0.045,
  "р": 0.040,
  "в": 0.038,
  "л": 0.035,
  "к": 0.028,
  "м": 0.026,
  "д": 0.025,
  "п": 0.023,
  "у": 0.021,
  "я": 0.018,
  "ы": 0.016,
  "ь": 0.014,
  "г": 0.013,
  "з": 0.012,
  "б": 0.014,
  "ч": 0.012,
  "й": 0.010,
  "х": 0.009,
  "ж": 0.007,
  "ш": 0.006,
  "ю": 0.006,
  "ц": 0.003,
  "щ": 0.003,
  "э": 0.003,
  "ф": 0.002,
} as const;


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
    encrypt: new FormControl<string>(ENCRYPT_TEXT_EXAMPLE.trim(), [
      Validators.maxLength(this.maxLength),
    ]),
    decrypt: new FormControl<string>(DECRYPT_TEXT_EXAMPLE, [
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

  /** Сдвинуть текст по алфавиту и добавить в один из контролов */
  public shiftTextAndSetControl(type: 'encrypt' | 'decrypt', m?: number): void {
    this.loading = true;
    const encryptControl: FormControl<string | null> = type === 'encrypt' ? this.cryptForm.controls['encrypt'] : this.cryptForm.controls['decrypt'];
    const decryptControl: FormControl<string | null> = type === 'encrypt' ? this.cryptForm.controls['decrypt'] : this.cryptForm.controls['encrypt'];
    const shift: number = m || m === 0 ? m : this.cryptForm.controls['m'].value || 0;
    const alphabet: string[] = !!this.cryptForm.controls['language'].value ? this.englishAlphabet : this.russianAlphabet;

    let text: string = encryptControl.value?.trim() || '';

    text = text
      .split('')
      .map((x: string) => x.toUpperCase())
      .map((x: string) => {
        if (x === 'Ё') {
          return 'Е';
        }

        return x;
      })
      .filter((x: string) => alphabet.includes(x))
      .map((char: string): string => {
        const index: number = (alphabet.indexOf(char) + shift) % alphabet.length;

        return alphabet[index];
      }).join('');
    decryptControl.setValue(text);
    this.loading = false;
  }

  /** Расшифровать Методом наименьших квадратов */
  public decrypt(): void {
    const decryptControl: FormControl<string | null> = this.cryptForm.controls['decrypt'];

    const bestShift: number = this.decryptCaesarWithLeastSquares(
      decryptControl.value || '',
      this.russianAlphabet,
      russianLetterFrequencies,
    );

    this.cryptForm.controls['m'].setValue(bestShift -1);

    this.shiftTextAndSetControl('decrypt', -bestShift + 1);
  }

  /** Расшифровка методом наименьших квадратов */
  private decryptCaesarWithLeastSquares(encryptedText: string, alphabet: string[], langFreq: IFrequencies) {
    const encryptedFreq: IFrequencies = this.getFrequency(encryptedText, alphabet);
    const langVector: number[] = alphabet.map((char) => langFreq[char] || 0);
    let bestShift: number = 0;
    let minError: number = Infinity;

    for (let shift: number = 0; shift < alphabet.length; shift++) {
      const shiftedVector: number[] = alphabet.map((char: string, i: number) => {
        const shiftedChar: string = alphabet[(i + shift) % alphabet.length];
        return encryptedFreq[shiftedChar] || 0;
      });

      const error: number = shiftedVector.reduce((sum: number, value: number, i: number) => {
        const diff: number = value - langVector[i];
        return sum + diff * diff;
      }, 0);

      if (error < minError) {
        minError = error;
        bestShift = shift;
      }
    }

    return bestShift;
  }


  /** Частотный анализ текста */
  private getFrequency(text: string, alphabet: string[]): IFrequencies {
    const frequency: IFrequencies = {};
    const total: number = text.split("").filter((char) => alphabet.includes(char)).length;

    for (const char of alphabet) {
      frequency[char] = text.split(char).length;
    }

    // Преобразуем в относительные частоты
    for (const char in frequency) {
      frequency[char] /= total || 1; // Защита от деления на 0
    }

    return frequency;
  }
}
