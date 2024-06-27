document.addEventListener('DOMContentLoaded', function () {
    const resistanceSlider = document.getElementById('resistance');
    const inductanceSlider = document.getElementById('inductance');
    const capacitanceSlider = document.getElementById('capacitance');
    const resistanceVal = document.getElementById('resistance-val');
    const inductanceVal = document.getElementById('inductance-val');
    const capacitanceVal = document.getElementById('capacitance-val');

    function updateValues() {
        const R = parseFloat(resistanceSlider.value);
        const L = parseFloat(inductanceSlider.value) * 1e-3; // Convert from mH to H
        const C = parseFloat(capacitanceSlider.value) * 1e-6; // Convert from µF to F

        // Update displayed values next to each slider
        resistanceVal.textContent = resistanceSlider.value ;
        inductanceVal.textContent = inductanceSlider.value ;
        capacitanceVal.textContent = capacitanceSlider.value ;

        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C)); // Calculate resonant frequency
        updatePlots(R, L, C, f0);
    }

    function updatePlots(R, L, C, f0) {
        const fMin = 0;
        const fMax = 2000;
        const fValues = Array.from({ length: 5001 }, (v, k) => fMin + k * (fMax - fMin) / 5000);
        const omegaValues = fValues.map(f => 2 * Math.PI * f);

        const HValues = omegaValues.map(omega => 1 / Math.sqrt(1 + Math.pow((omega * L / R) - (1 / (omega * R * C)), 2)));
        const attenuationValues = omegaValues.map(omega => -10 * Math.log10(1 + Math.pow((omega * L / R) - (1 / (omega * R * C)), 2)));
        const phaseShiftValues = omegaValues.map(omega => Math.atan((omega * L - 1 / (omega * C)) / R));

        plotGraph('plot', fValues, HValues, `Transferencia (f₀: ${f0.toFixed(2)} Hz)`, 'Frecuencia (Hz)', 'Magnitud de Transferencia', [0, 1]);
        plotGraph('attenuation-plot', fValues, attenuationValues, `Atenuación (f₀: ${f0.toFixed(2)} Hz)`, 'Frecuencia (Hz)', 'Atenuación (dB)', [-50, 0]);
        plotGraph('phase-shift-plot', fValues, phaseShiftValues, `Desfasaje (f₀: ${f0.toFixed(2)} Hz)`, 'Frecuencia (Hz)', 'Desfasaje (radianes)', [-Math.PI / 2, Math.PI / 2]);
    }

    function plotGraph(plotId, xValues, yValues, title, xAxisTitle, yAxisTitle, yAxisRange) {
        const trace = {
            x: xValues,
            y: yValues,
            mode: 'lines',
            name: title
        };

        const layout = {
            title: title,
            xaxis: {
                title: xAxisTitle,
                range: [0, 2000]
            },
            yaxis: {
                title: yAxisTitle,
                range: yAxisRange
            }
        };

        Plotly.newPlot(plotId, [trace], layout);
    }

    resistanceSlider.addEventListener('input', updateValues);
    inductanceSlider.addEventListener('input', updateValues);
    capacitanceSlider.addEventListener('input', updateValues);

    updateValues(); // Ensure the plots are generated on page load
});
