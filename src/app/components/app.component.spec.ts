import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });

  it('shows the name and nationality, but no full name or date of birth', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent!;
    expect(text).toContain('Louay Morsi');
    expect(text).toContain('German / Egyptian');
    expect(text).not.toContain('Hesham Saber');
    expect(text).not.toContain('Date of birth');
  });

  it('toggles a section when its button is clicked', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Work Experience:');
    const buttons = el.querySelectorAll<HTMLButtonElement>('button.btn');
    buttons[1].click();
    await fixture.whenStable();
    expect(el.textContent).toContain('Education:');
    expect(el.textContent).not.toContain('Work Experience:');
  });
});
